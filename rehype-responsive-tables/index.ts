/*
 * Wraps tables in scrollable divs to make them responsive.
 */
import { wrapAll } from '../rehype-wrap-all'

export function responsiveTables() {
	return wrapAll(
		...[
			{
				selector: 'table',
				wrapper: 'div.hscroll',
			},
		],
	)
}
