import Link from "next/link";

const BottomNavbar = () => {
    return (
        <div className="bg-white shadow-inner py-4 w-full">
            <div className="px-4">
                <div className="flex justify-center">
                    <Link
                        href="/privacy-policy"
                        className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
                    >
                        プライバシーポリシー
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BottomNavbar;
