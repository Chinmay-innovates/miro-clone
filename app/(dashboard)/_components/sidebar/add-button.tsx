"use client";

import { Hint } from "@/components/hint";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateOrganization } from "@clerk/nextjs";
import { PlusIcon } from "lucide-react";

export const AddButton = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<div className="aspect-square">
					<Hint
						label="Create Organization"
						side="right"
						align="start"
						sideOffset={15}
					>
						<button className="bg-white/25 h-full w-full rounded-md flex items-center justify-center opacity-60 hover:opacity-100 transition">
							<PlusIcon className="text-white" />
						</button>
					</Hint>
				</div>
			</DialogTrigger>
			<DialogContent className="border-none p-0 bg-transparent max-w-[480px]">
				<CreateOrganization />
			</DialogContent>
		</Dialog>
	);
};
