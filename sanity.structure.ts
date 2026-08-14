import type { StructureResolver } from 'sanity/structure';
import { DocumentIcon } from '@sanity/icons/Document';
import { DocumentTextIcon } from '@sanity/icons/DocumentText';
import { UsersIcon } from '@sanity/icons/Users';
import { EditIcon } from '@sanity/icons/Edit';
import { SparkleIcon } from '@sanity/icons/Sparkle';
import { LinkIcon } from '@sanity/icons/Link';

export const structure: StructureResolver = (S) =>
	S.list()
		.title('Portfolio 2026 Content')
		.items([
			// 1. Singleton — Header
			S.listItem()
				.title('Header')
				.icon(LinkIcon)
				.child(
					S.document()
						.schemaType('header')
						.documentId('header')
						.title('Header Settings'),
				),

			// 1b. Singleton — Footer
			S.listItem()
				.title('Footer')
				.icon(LinkIcon)
				.child(
					S.document()
						.schemaType('footer')
						.documentId('footer')
						.title('Footer Settings'),
				),

				// 2. Singleton — Homepage
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

			// 3. Case Studies
			S.documentTypeListItem('caseStudy')
				.title('Case Studies')
				.icon(DocumentTextIcon),

			// 4. Blog Posts
			S.documentTypeListItem('blogPost')
				.title('Blog Posts')
				.icon(EditIcon),

			// 4b. Experiments (side projects / mini case studies)
			S.documentTypeListItem('experiment')
				.title('Experiments')
				.icon(SparkleIcon),

			// 5. Clients
			S.documentTypeListItem('client')
				.title('Clients')
				.icon(UsersIcon),
		]);
