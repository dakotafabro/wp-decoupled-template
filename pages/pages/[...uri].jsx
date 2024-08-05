import { setOutgoingHeaders } from '@pantheon-systems/wordpress-kit';
import { ContentWithImage } from '@pantheon-systems/nextjs-kit';
import { NextSeo } from 'next-seo';
import Layout from '../../components/layout';

import { getFooterMenu } from '../../lib/Menus';
import { getPageByUri, getPagePreview } from '../../lib/Pages';
import styles from './page.module.css';

export default function PageTemplate({ menuItems, page, preview }) {
	return (
		<Layout footerMenu={menuItems} preview={preview}>
			<NextSeo title="" description="" />
			<ContentWithImage
				title={page.title}
				content={page.content}
				date={new Date(page.date).toDateString()}
				imageProps={
					page.featuredImage
						? {
								src: page.featuredImage?.node.sourceUrl,
								alt: page.featuredImage?.node.altText,
						  }
						: undefined
				}
				contentClassName={styles.content}
			/>
		</Layout>
	);
}

export async function getServerSideProps({
	params: { uri },
	res,
	preview,
	previewData,
}) {
	const { menuItems, menuItemHeaders } = await getFooterMenu();
	const { page, headers: pageHeaders = false } = preview
		? await getPagePreview(previewData.key)
		: await getPageByUri(uri);

	if (!page) {
		return {
			notFound: true,
		};
	}

	const headers = pageHeaders && [menuItemHeaders, pageHeaders];
	headers.length > 0 && setOutgoingHeaders({ headers, res });

	return {
		props: {
			menuItems,
			page,
			preview: Boolean(preview),
		},
	};
}
