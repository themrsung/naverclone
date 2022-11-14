from collections import deque

def solution(n, roads, sources, destination):
    paths = []
    nodes = {}
    
    for i in range(n):
        nodes[n + 1] = [0]
    
    for road in roads:
        try:
            nodes[road[0]].append(road[1])
        except:
            nodes[road[0]] = [road[1]]
            
        try:
            nodes[road[1]].append(road[0])
        except:
            nodes[road[1]] = [road[0]]
            
    results = []
    for source in sources:
        prev_nodes = [source]
        visited_nodes = deque([])
        dist = -1
        
        for i in range(n + 1):
            if destination in prev_nodes:
                dist = i
                break
            
            next_nodes = deque([])
            
            for prev_node in prev_nodes:
                for adj in nodes[prev_node]:
                    if adj not in next_nodes and adj not in visited_nodes:
                        next_nodes.append(adj)
                        visited_nodes.append(adj)
                    
            prev_nodes = next_nodes
            
        results.append(dist)
        
    return results            

print(solution(5, [[1, 2], [1, 4], [2, 4], [2, 5], [4, 5]], [1, 3, 5],  1))