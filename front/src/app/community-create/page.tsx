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

    const router = useRouter();


    const handleCreate = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();


        try {
            const isSuccess = await createCommunity(communityName, description, new Date(startDate));
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
                <br />
                <br />

                <textarea
                    id="description"
                    rows={7}
                    placeholder="コミュニティの説明"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                ></textarea>


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