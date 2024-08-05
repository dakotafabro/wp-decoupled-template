import { setOutgoingHeaders } from '@pantheon-systems/wordpress-kit';
import { NextSeo } from 'next-seo';
import Link from 'next/link';

import Layout from '../../components/layout';
import PageHeader from '../../components/page-header';

import { getFooterMenu } from '../../lib/Menus';
import styles from './index.module.css';

export default function ExamplesPageTemplate({ menuItems }) {
	return (
		<Layout footerMenu={menuItems}>
			<NextSeo title="" description="" />
			<PageHeader title="Examples" />
			<section className={styles.container}>
				<div className={styles.content}>
					<Link passHref href="/">
						<span>Home &rarr;</span>
					</Link>
					<p>
						This page outlines a growing list of common use cases that can be
						used as a reference when building using this starter kit. If you
						don&apos;t need them for your site, feel free to delete the
						`pages/examples` directory in your codebase.
					</p>
					<ul>
						<li>
							<Link href="/examples/auth-api">API Authorization</Link> -
							confirms that Next.js is able to make authenticated requests to
							WordPress&apos; API.
						</li>
						<li>
							<Link href="/examples/ssg-isr">SSG and ISR</Link> - by default,
							this starter kit is optimized for SSR and Edge Caching on
							Pantheon. This example is provided for cases where Next.js static
							generation options would be beneficial.
						</li>
						<li>
							<Link href="/examples/pagination">Pagination</Link> - a paginated
							list with a large dataset.
						</li>
					</ul>
				</div>
			</section>
		</Layout>
	);
}

export async function getServerSideProps({ res }) {
	const { menuItems, menuItemHeaders } = await getFooterMenu();

	setOutgoingHeaders({ headers: [menuItemHeaders], res });

	return {
		props: {
			menuItems,
		},
	};
}
