import { TreeDataNode } from "antd";
import { Key } from "react";

export const findMatchingKeys = (data: TreeDataNode[], searchText: string): Key[] => {
    if (!searchText) return [];

    const matches: Key[] = [];

    const searchRecursive = (nodes: TreeDataNode[]) => {
        nodes.forEach(item => {
            const titleMatch = item.title?.toString().toLowerCase().includes(searchText.toLowerCase());
            if (titleMatch) {
                matches.push(item.key as Key);
            }
            if (item.children) {
                searchRecursive(item.children);
            }
        });
    };

    searchRecursive(data);
    return matches;
};


export const highlightMatches = (
    data: TreeDataNode[],
    searchText: string,
    highlightedKeys: Key[] = []
): TreeDataNode[] => {
    if (!searchText) return data;

    return data.map(item => {
        const newItem = { ...item };
        const titleMatch = newItem.title?.toString().toLowerCase().includes(searchText.toLowerCase());

        if (titleMatch && newItem.title) {
            const titleStr = newItem.title.toString();
            const index = titleStr.toLowerCase().indexOf(searchText.toLowerCase());
            const beforeStr = titleStr.substring(0, index);
            const matchStr = titleStr.substring(index, index + searchText.length);
            const afterStr = titleStr.substring(index + searchText.length);

            newItem.title = (
                <span style={{ backgroundColor: highlightedKeys.includes(newItem.key as Key) ? '#fffb8f' : 'transparent' }}>
          {beforeStr}
                    <span style={{ color: '#f50', fontWeight: 'bold' }}>{matchStr}</span>
                    {afterStr}
        </span>
            );
        }

        if (newItem.children) {
            newItem.children = highlightMatches(newItem.children, searchText, highlightedKeys);
        }

        return newItem;
    });
};

export const getParentKeys = (
    key: Key,
    data: TreeDataNode[],
    currentPath: Key[] = []
): Key[] => {
    for (const item of data) {
        if (item.key === key) {
            return currentPath;
        }

        if (item.children) {
            const found = getParentKeys(key, item.children, [...currentPath, item.key as Key]);
            if (found.length > 0) {
                return found;
            }
        }
    }
    return [];
};


export const getExpandedKeysForSearch = (
    matchingKeys: Key[],
    data: TreeDataNode[]
): Key[] => {
    const parentKeys: Key[] = [];

    matchingKeys.forEach(key => {
        const parents = getParentKeys(key, data);
        parents.forEach(parentKey => {
            if (!parentKeys.includes(parentKey)) {
                parentKeys.push(parentKey);
            }
        });
    });

    return parentKeys;
};

export const filterTreeData = (data: TreeDataNode[], searchValue: string): TreeDataNode[] => {
    if (!searchValue) return data;

    return data.filter(item => {
        const titleMatch = item.title?.toString().toLowerCase().includes(searchValue.toLowerCase());

        let childrenMatch = false;
        if (item.children) {
            const filteredChildren = filterTreeData(item.children, searchValue);
            childrenMatch = filteredChildren.length > 0;
        }

        return titleMatch || childrenMatch;
    });
};
