import { NextSeo } from 'next-seo';

import { PostGrid } from '../../components/grid';
import Layout from '../../components/layout';
import PageHeader from '../../components/page-header';

import { getFooterMenu } from '../../lib/Menus';
import { getLatestPosts } from '../../lib/Posts';
import styles from './ssg-isr.module.css';

export default function SSGISRExampleTemplate({ menuItems, posts }) {
	return (
		<Layout footerMenu={menuItems}>
			<NextSeo title="" description="" />
			<PageHeader title="Posts" />
			<div className={styles.container}>
				<p>
					<em>
						By default, this starter kit is optimized for SSR and Edge Caching
						on Pantheon. This example instead uses Incremental Static
						Regeneration and is provided as a reference for cases where Next.js
						static generation options would be beneficial.
					</em>
				</p>
			</div>
			<section>
				<PostGrid contentType="posts" data={posts} />
			</section>
		</Layout>
	);
}

export async function getStaticProps() {
	const { menuItems } = await getFooterMenu();
	const { posts } = await getLatestPosts(100);

	return {
		props: {
			menuItems,
			posts,
		},
		revalidate: 60,
	};
}
