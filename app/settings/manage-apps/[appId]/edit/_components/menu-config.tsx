"use client"

import { Button } from "@/components/ui/button";

import { Config } from "../page";
import { LinkFormComponent } from "./_components/link-form";

interface Props {
	data: {
		subLinks: Array<Config>
	}
	id: string
}

export const MenuConfig = ({ data, id }: Props) => {
	return (
		<div className="flex flex-col w-full max-w-lg gap-4">
			<div className="w-full flex flex-col gap-1">
				{data.subLinks.map((item) => (
					<div key={item._id} className="w-full">
						<Button
							className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
							asChild
						>
							<LinkFormComponent data={{
								basicInformation: {
									name: item.title
								},
								link: {
									applicationUrl: item.link,
									applicationUrlType: item.type,
								},
							}} id={id} fieldId={item._id} menuType="menu-config" linkType="sub-link-edit" openButtonText={item.title} />
						</Button>
					</div>
				))}
			</div>
			<LinkFormComponent data={{
				basicInformation: {
					name: ""
				},
				link: {
					applicationUrl: "",
					applicationUrlType: "iframe"
				},
			}} id={id} menuType="menu-config" linkType="sub-link-create" openButtonText="Adicionar sublink" />
		</div>
	);
}
