"""Concurrency utilities for bounded parallelism."""

import asyncio
from typing import Callable, TypeVar, Awaitable

T = TypeVar("T")
R = TypeVar("R")


async def map_with_concurrency(
    items: list[T],
    concurrency: int,
    handler: Callable[[T, int], Awaitable[R]],
) -> list[R]:
    """Map items to results with bounded concurrency.

    Args:
        items: List of items to process.
        concurrency: Maximum number of concurrent tasks.
        handler: Async function that processes an item and its index.

    Returns:
        List of results in the same order as items.
    """
    if not items:
        return []

    results: list[R | None] = [None] * len(items)
    semaphore = asyncio.Semaphore(concurrency)
    cursor = 0
    cursor_lock = asyncio.Lock()

    async def worker() -> None:
        nonlocal cursor
        while True:
            async with cursor_lock:
                if cursor >= len(items):
                    return
                index = cursor
                cursor += 1

            async with semaphore:
                result = await handler(items[index], index)
                results[index] = result

    # Create workers
    worker_count = min(concurrency, len(items))
    tasks = [asyncio.create_task(worker()) for _ in range(worker_count)]

    # Wait for all workers to complete
    await asyncio.gather(*tasks)

    return results  # type: ignore
