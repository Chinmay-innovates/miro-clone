"use client";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Star } from "lucide-react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { OrgSwitcher } from "@/components/org-switcher";
const font = Poppins({
	subsets: ["latin"],
	variable: "--font-poppins",
	weight: ["600"],
});
export const OrgSidebar = () => {
	const searchParams = useSearchParams();
	const favourites = searchParams.get("favourites");
	return (
		<div className="hidden lg:flex flex-col space-y-6 w-[206px] pl-5 pt-5">
			<Link href="/">
				<div className="flex items-center gap-x-2">
					<Image src="/logo.png" alt="logo" width={60} height={60} />
					<span className={cn("font-semibold text-2xl", font.className)}>
						Miro
					</span>
				</div>
			</Link>
			<OrgSwitcher />
			<div className="space-y-1 w-full">
				<Button
					variant={favourites ? "ghost" : "secondary"}
					asChild
					size="lg"
					className="font-normal px-2 justify-start w-full"
				>
					<Link href="/">
						<LayoutDashboard className="size-4 mr-2" />
						Team boards
					</Link>
				</Button>
				<Button
					asChild
					size="lg"
					variant={favourites ? "secondary" : "ghost"}
					className="font-normal px-2 justify-start w-full"
				>
					<Link
						href={{
							pathname: "/",
							query: { favourites: true },
						}}
					>
						<Star className="size-4 mr-2" />
						Favourite boards
					</Link>
				</Button>
			</div>
		</div>
	);
};
