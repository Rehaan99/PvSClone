export default function collision(first, second) {
	if (
		first.x !== undefined &&
		first.y !== undefined &&
		second.x !== undefined &&
		second.y !== undefined &&
		!(
			first.x > second.x + second.width ||
			first.x + first.width < second.x ||
			first.y > second.y + second.height ||
			first.y + first.height < second.y
		)
	) {
		return true;
	}
	return false;
}
export { collision };
