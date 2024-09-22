import { OrganizationSwitcher } from "@clerk/nextjs";

interface OrgSwitcherProps {
	maxWidth?: string;
}

export const OrgSwitcher = ({ maxWidth }: OrgSwitcherProps) => {
	return (
		<OrganizationSwitcher
			hidePersonal
			appearance={{
				elements: {
					rootBox: {
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						width: "100%",
						maxWidth: maxWidth,
					},
					organizationSwitcherTrigger: {
						padding: "6px",
						width: "100%",
						borderRadius: "8px",
						border: "1px solid #E5E7EB",
						justifyContent: "space-between",
						backgroundColor: "#F9FAFB",
					},
				},
			}}
		/>
	);
};
