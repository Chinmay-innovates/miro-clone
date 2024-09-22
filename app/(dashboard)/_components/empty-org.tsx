import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateOrganization } from "@clerk/nextjs";
import Image from "next/image";

export const EmptyOrg = () => {
	return (
		<div className="h-full flex flex-col items-center justify-center">
			<Image
				src="/elements.svg"
				alt="Empty organization"
				width={300}
				height={300}
			/>
			<h2 className="mt-6 text-2xl font-semibold">Welcome to Miro clone</h2>
			<p className="text-muted-foreground text-sm mt-2">
				Create an organization to get started
			</p>
			<div className="mt-6">
				<Dialog>
					<DialogTrigger asChild>
						<Button size="lg">Create organization</Button>
					</DialogTrigger>
					<DialogContent className="p-0 bg-transparent max-w-[480px] border-none">
						<CreateOrganization />
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
};
