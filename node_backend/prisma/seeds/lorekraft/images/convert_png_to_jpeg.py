#!/usr/bin/env python3

from __future__ import annotations

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError as exc:  # pragma: no cover
    raise SystemExit(
        'Pillow is required to run this script. Install it with: pip install Pillow'
    ) from exc


DEFAULT_DIRECTORY = Path('/home/ubuntu/projects/MLBots-server/static/media/images/lorekraft')


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description='Convert PNG files in a directory to JPEG while preserving the basename.',
    )
    parser.add_argument(
        'directory',
        nargs='?',
        default=str(DEFAULT_DIRECTORY),
        help='Directory to scan. Defaults to the LoreKraft image folder.',
    )
    parser.add_argument(
        '--delete-source',
        action='store_true',
        help='Delete the original PNG after a successful JPEG conversion.',
    )
    parser.add_argument(
        '--quality',
        type=int,
        default=95,
        help='JPEG quality from 1-100. Default: 95.',
    )
    return parser


def iter_png_files(directory: Path) -> list[Path]:
    return sorted(
        path for path in directory.iterdir() if path.is_file() and path.suffix.lower() == '.png'
    )


def convert_png_to_jpeg(source_path: Path, quality: int) -> Path:
    target_path = source_path.with_suffix('.jpeg')

    with Image.open(source_path) as image:
        rgb_image = image.convert('RGB')
        rgb_image.save(target_path, 'JPEG', quality=quality, optimize=True)

    return target_path


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    directory = Path(args.directory).expanduser().resolve()

    if not directory.exists():
        print(f'Directory does not exist: {directory}', file=sys.stderr)
        return 1

    if not directory.is_dir():
        print(f'Path is not a directory: {directory}', file=sys.stderr)
        return 1

    png_files = iter_png_files(directory)

    if not png_files:
        print(f'No PNG files found in {directory}')
        return 0

    converted = 0
    skipped = 0

    for source_path in png_files:
        target_path = source_path.with_suffix('.jpeg')

        if target_path.exists():
            skipped += 1
            print(f'Skipped existing JPEG: {target_path.name}')
            continue

        try:
            convert_png_to_jpeg(source_path, quality=args.quality)

            if args.delete_source:
                source_path.unlink()

            converted += 1
            print(f'Converted: {source_path.name} -> {target_path.name}')
        except Exception as exc:  # pragma: no cover
            skipped += 1
            print(f'Failed: {source_path.name} ({exc})', file=sys.stderr)

    print(
        {
            'directory': str(directory),
            'pngFiles': len(png_files),
            'converted': converted,
            'skipped': skipped,
            'deleteSource': args.delete_source,
        }
    )
    return 0


if __name__ == '__main__':
    raise SystemExit(main())