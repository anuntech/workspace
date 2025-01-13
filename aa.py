def count_ways_to_reach_end(start, end):
    if start == end:
        return 1
    
    if start > end:
        return 0
    
    return (count_ways_to_reach_end(start + 1, end) +
            count_ways_to_reach_end(start + 2, end) +
            count_ways_to_reach_end(start + 3, end))


S, E = map(int, input().split())

result = count_ways_to_reach_end(S, E)
print(result)
