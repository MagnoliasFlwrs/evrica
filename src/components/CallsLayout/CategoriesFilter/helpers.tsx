import React from "react";
import {TreeDataNode} from "antd";
import {Category, CategoryLocation, SubLocation} from "./types";

export const extractCategoryIdFromKey = (key: React.Key): number | null => {
    if (typeof key === 'string' && key.startsWith('category-')) {
        return parseInt(key.replace('category-', ''), 10);
    }
    return null;
};

export const findCategoryIdsInTree = (keys: React.Key[], treeData: TreeDataNode[]): number[] => {
    const categoryIds: number[] = [];

    const searchRecursive = (nodes: TreeDataNode[]) => {
        nodes.forEach(node => {
            if (keys.includes(node.key)) {
                const categoryId = extractCategoryIdFromKey(node.key);
                if (categoryId) {
                    categoryIds.push(categoryId);
                }
            }
            if (node.children) {
                searchRecursive(node.children);
            }
        });
    };

    searchRecursive(treeData);
    return categoryIds;
};
 export const findMatchingKeys = (data: TreeDataNode[], searchText: string): React.Key[] => {
    if (!searchText) return [];

    const matches: React.Key[] = [];

    const searchRecursive = (nodes: TreeDataNode[]) => {
        nodes.forEach(item => {
            const titleMatch = item.title?.toString().toLowerCase().includes(searchText.toLowerCase());
            if (titleMatch) {
                matches.push(item.key as React.Key);
            }
            if (item.children) {
                searchRecursive(item.children);
            }
        });
    };

    searchRecursive(data);
    return matches;
};

export const getParentKeys = (key: React.Key, data: TreeDataNode[], currentPath: React.Key[] = []): React.Key[] => {
    for (const item of data) {
        if (item.key === key) {
            return currentPath;
        }

        if (item.children) {
            const found = getParentKeys(key, item.children, [...currentPath, item.key as React.Key]);
            if (found.length > 0) {
                return found;
            }
        }
    }
    return [];
};