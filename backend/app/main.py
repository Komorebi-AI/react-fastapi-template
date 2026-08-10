#!/usr/bin/env python
# Use A | B syntax for Union types in Python 3.9
from __future__ import annotations

from importlib.metadata import PackageNotFoundError, version

try:
    __version__: str | None = version("app")
except PackageNotFoundError:
    # package is not installed
    __version__ = None


def print_version() -> None:
    """Print package version."""
    print(f"React Template Backend version {__version__}")


if __name__ == "__main__":
    print_version()
