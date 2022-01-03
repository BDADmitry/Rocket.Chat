import { css } from '@rocket.chat/css-in-js';
import { Box } from '@rocket.chat/fuselage';
import React, { ReactNode, useRef, ReactElement } from 'react';

import { useLayout } from '../../../../../contexts/LayoutContext';
import { ToolboxDropdownDesktop } from './ToolboxDropdownDesktop';
import { ToolboxDropdownMobile } from './ToolboxDropdownMobile';

const style = css`
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
`;
export const ToolboxDropdown = <R extends HTMLElement>({
	onClose,
	reference,
	children,
}: {
	reference: React.RefObject<R>;
	onClose: () => void;
	children: ReactNode;
}): ReactElement => {
	const { isMobile } = useLayout();
	const target = useRef<HTMLButtonElement>(null);

	const DropdownTemplate = isMobile ? ToolboxDropdownMobile : ToolboxDropdownDesktop;
	return (
		<>
			<Box onClick={onClose} className={style} position='fixed' />
			<DropdownTemplate onClose={onClose} ref={target} reference={reference}>
				{children}
			</DropdownTemplate>
		</>
	);
};