"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createCommunity } from "@/service/supabase/updates/createCommunity";

const CreateCommunity = () => {
    const [communityName, setCommunityName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [memberLimits, setMemberLimits] = useState<number>(5);
    const [nickname, setNickname] = useState<string>("");

    const router = useRouter();

    const handleCreate = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        try {
            const isSuccess = await createCommunity(communityName, description, new Date(startDate), memberLimits, nickname);
            if (isSuccess) {
                alert("コミュニティ作成しました");
            }
            //router.push("/community");
        } catch (error) {
            alert('予期しないエラー');
        }
    };

    return (
        <div>
            <h1>コミュニティ新規作成</h1>

            <form onSubmit={handleCreate}>

                <br></br>
                <input
                    id="communityName"
                    type="text"
                    placeholder="コミュニティ名"
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                    required
                />
                <br /><br />

                <textarea
                    id="description"
                    rows={7}
                    placeholder="コミュニティの説明"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                ></textarea>
                <br />
                <input
                    id="memberLimits"
                    type="text"
                    placeholder="個人が特定されないニックネーム"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                />
                <br />
                <input
                    id="memberLimits"
                    type="number"
                    placeholder="メンバー上限人数"
                    value={memberLimits}
                    onChange={(e) => setMemberLimits(Number(e.target.value))}
                    required
                />

                <div>
                    <label htmlFor="startDate">開始日</label>
                    <input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                >
                    作成
                </button>
            </form>

            <div>
                <Link href="/" >ホーム</Link>
            </div>
        </div>
    );
};

export default CreateCommunity;
