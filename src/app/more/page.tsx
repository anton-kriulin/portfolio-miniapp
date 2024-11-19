import { MoreHeader, NavBar, Settings } from "@/components";

export default function MorePage() {
    return (
        <>
            <MoreHeader />
            <Settings />
            <NavBar currentPage={{ code: 'more' }} />
        </>
    );
}