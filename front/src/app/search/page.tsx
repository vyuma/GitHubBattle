/*
Q. どういうアルゴリズムでコミュニティ一覧を表示する？
- 全てのコミュニティを表示する？
- フィルター検索できるようにする？
    - 「あ」行、「か」行、「さ」行 などの頭文字ごとにコミュニティを調べられるようにする、など
*/

"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import toast, { Toaster } from "react-hot-toast";

import { Community } from '../types';

const Search: React.FC = () => {
    const [communities, setCommunities] = useState<Community[]>([]);

    useEffect(() => {
        fetchCommunities();
    }, []);

    const fetchCommunities = async (): Promise<void> => {
        try {
            const response = await fetch("http://localhost:8000/communities");
            if (response.ok) {
                const data = await response.json();
                setCommunities(data);
                toast.success("Fetched communities");
            } else {
                console.error("Failed to fetch communities");
                toast.error("Failed to fetch communities");
            }
        } catch (error) {
            console.error("An error occurred", error);
            toast.error("An error occurred");
        }
    };

    return (
        <div>
            <Toaster />
            <h1>コミュニティ一覧</h1>

            <br /><br />
            <div>
                {communities.map((community) => (
                    <div key={community.id}>
                        <p>コミュニティ名: {community.name}</p> &nbsp;
                        <Link href={`/community/${community.id}`}>詳細</Link>
                    </div>
                ))}
            </div>

            <Link href="/">ホーム</Link>

        </div>
    );
};

export default Search;
