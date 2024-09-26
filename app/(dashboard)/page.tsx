"use client";
import { useOrganization } from "@clerk/nextjs";
import { EmptyOrg } from "./_components/empty-org";
import { BoardList } from "./_components/board-list";
import { useSearchParams } from "next/navigation";

// interface DashboardPageProps {
// 	searchParams: {
// 		search?: string;
// 		favourites?: string;
// 	};
// }

export default function DashboardPage() {
	const { organization } = useOrganization();
	const searchParams = useSearchParams();
	const search = searchParams.get("search") || undefined;
	const favourites = searchParams.get("favourites") || undefined;
	return (
		<div className="flex-1 h-[calc(100vh-80px)] p-6">
			{!organization ? (
				<EmptyOrg />
			) : (
				<BoardList orgId={organization.id} query={{ search, favourites }} />
			)}
		</div>
	);
}
