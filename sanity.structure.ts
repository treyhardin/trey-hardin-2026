import type { StructureResolver } from 'sanity/structure';
import { DocumentIcon } from '@sanity/icons/Document';
import { DocumentTextIcon } from '@sanity/icons/DocumentText';
import { UsersIcon } from '@sanity/icons/Users';
import { EditIcon } from '@sanity/icons/Edit';

export const structure: StructureResolver = (S) =>
	S.list()
		.title('Portfolio 2026 Content')
		.items([
			// 1. Singleton — Homepage
			S.listItem()
				.title('Homepage')
				.icon(DocumentIcon)
				.child(
					S.document()
						.schemaType('homepage')
						.documentId('homepage')
						.title('Homepage'),
			),

			S.divider(),

			// 2. Case Studies
			S.documentTypeListItem('caseStudy')
				.title('Case Studies')
				.icon(DocumentTextIcon),

			// 3. Blog Posts
			S.documentTypeListItem('blogPost')
				.title('Blog Posts')
				.icon(EditIcon),

			// 4. Clients
			S.documentTypeListItem('client')
				.title('Clients')
				.icon(UsersIcon),
		]);
