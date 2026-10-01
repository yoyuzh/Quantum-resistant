"""Archive metadata preflight and bounded decompressed TAR reads."""
from __future__ import annotations

import struct
from backend.collection_config import MAX_ARCHIVE_MEMBERS, MAX_ARCHIVE_METADATA_BYTES, MAX_ARCHIVE_EXPANDED_BYTES
from backend.collection_common import CollectionError


class ArchiveLimit(CollectionError):
    pass


def zip_preflight(stream, budget) -> None:
    """Read EOCD/ZIP64 counts before ZipFile allocates the central directory."""
    budget.remaining()
    stream.seek(0, 2)
    size = stream.tell()
    stream.seek(max(0, size - 65557))
    tail = stream.read(65557)
    end = len(tail)
    record = None
    while end:
        index = tail.rfind(b'PK\x05\x06', 0, end)
        if index < 0:
            break
        if index + 22 <= len(tail):
            candidate = struct.unpack('<4s4H2IH', tail[index:index + 22])
            if index + 22 + candidate[-1] == len(tail):
                record = candidate
                break
        end = index
    if record is None:
        raise CollectionError('ZIP 归档目录无效')
    members, metadata = record[4], record[5]
    directory_end = size - len(tail) + index
    if members == 65535 or metadata == 0xffffffff or record[6] == 0xffffffff:
        absolute = size - len(tail) + index
        if absolute < 20:
            raise CollectionError('ZIP64 归档目录无效')
        stream.seek(absolute - 20)
        locator = stream.read(20)
        if locator[:4] != b'PK\x06\x07':
            raise CollectionError('ZIP64 归档目录无效')
        _, disk, offset, disks = struct.unpack('<4sIQI', locator)
        if disk or disks != 1 or offset > size - 56:
            raise CollectionError('ZIP64 归档目录无效')
        stream.seek(offset)
        data = stream.read(56)
        if len(data) != 56 or data[:4] != b'PK\x06\x06':
            raise CollectionError('ZIP64 归档目录无效')
        values = struct.unpack('<4sQ2H2I4Q', data)
        members, metadata = values[7], values[8]
        directory_end = offset
        if values[1] > MAX_ARCHIVE_METADATA_BYTES:
            raise ArchiveLimit('归档元数据超过 64 MiB 限制')
    if members > MAX_ARCHIVE_MEMBERS or metadata > MAX_ARCHIVE_METADATA_BYTES:
        raise ArchiveLimit('归档成员数量或元数据超过限制')
    if record[1] or record[2]:
        raise CollectionError('不支持分卷 ZIP 归档')
    if metadata > directory_end:
        raise CollectionError('ZIP 归档目录无效')
    # EOCD counts can lie. Count actual headers without materializing ZipInfo.
    stream.seek(directory_end - metadata)
    actual = 0
    while stream.tell() < directory_end:
        budget.remaining()
        header = stream.read(46)
        if len(header) != 46 or header[:4] != b'PK\x01\x02':
            raise CollectionError('ZIP 归档目录无效')
        actual += 1
        if actual > MAX_ARCHIVE_MEMBERS:
            raise ArchiveLimit('归档成员数量超过限制')
        variable = sum(struct.unpack('<3H', header[28:34]))
        if stream.tell() + variable > directory_end:
            raise CollectionError('ZIP 归档目录无效')
        stream.seek(variable, 1)
    stream.seek(0)


class ExpandedReader:
    """tarfile reads only bounded output from the decompressor, including skipped entries."""
    def __init__(self, stream, budget):
        self.stream, self.budget = stream, budget
        self.bytes = 0

    def read(self, size=-1):
        self.budget.remaining()
        remaining = MAX_ARCHIVE_EXPANDED_BYTES - self.bytes
        data = self.stream.read(min(65536, remaining + 1, size) if size >= 0 else min(65536, remaining + 1))
        self.bytes += len(data)
        if self.bytes > MAX_ARCHIVE_EXPANDED_BYTES:
            raise ArchiveLimit('归档展开数据超过 1 GiB 限制')
        return data

    def tell(self):
        return self.bytes
