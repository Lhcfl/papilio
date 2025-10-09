export const LoadingTrigger = (props: {
	onShow: () => void;
	children?: React.ReactNode;
}) => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver((ent) => {
			if (ent[0].isIntersecting) {
				props.onShow();
			}
		});

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => {
			observer.disconnect();
		};
	}, [props]);

	return <div ref={ref}>{props.children}</div>;
};
