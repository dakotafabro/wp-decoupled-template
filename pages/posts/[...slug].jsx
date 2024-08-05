import { setOutgoingHeaders } from '@pantheon-systems/wordpress-kit';
import { ContentWithImage } from '@pantheon-systems/nextjs-kit';
import { NextSeo } from 'next-seo';

import Layout from '../../components/layout';
import { getFooterMenu } from '../../lib/Menus';
import { getPostByUri, getPostPreview } from '../../lib/Posts';
import { PostGrid } from '../../components/grid';
import styles from './[...slug].module.css';

export default function PostTemplate({ menuItems, post, preview }) {
	return (
		<Layout footerMenu={menuItems} preview={preview}>
			<NextSeo title="" description="" />
			<ContentWithImage
				title={post.title}
				content={post.content}
				date={new Date(post.date).toDateString()}
				imageProps={
					post.featuredImage
						? {
								src: post?.featuredImage?.node.sourceUrl,
								alt: post?.featuredImage?.node.altText,
						  }
						: undefined
				}
				contentClassName={styles.content}
			/>
			{post.relatedContent?.relatedPosts ? (
				<section>
					<header className={styles.acfHeader}>
						<h2>Related Content</h2>
					</header>
					<PostGrid
						contentType="posts"
						data={post.relatedContent.relatedPosts}
					/>
				</section>
			) : null}
		</Layout>
	);
}

export async function getServerSideProps({
	params: { slug },
	res,
	preview,
	previewData,
}) {
	const { menuItems, menuItemHeaders } = await getFooterMenu();
	const { post, headers: postHeaders = false } = preview
		? await getPostPreview(previewData.key)
		: await getPostByUri(slug);

	if (!post) {
		return {
			notFound: true,
		};
	}

	const headers = postHeaders && [menuItemHeaders, postHeaders];
	headers.length > 0 && setOutgoingHeaders({ headers, res });

	return {
		props: {
			menuItems,
			post,
			preview: Boolean(preview),
		},
	};
}
