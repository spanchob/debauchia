import Choice from "./choice";
import _ from "lodash";

function Ending(props: {
	title: string;
	traits: any;
	description: string;
	data: any;
	stateTraits: any;
}) {
	function conditionalChecker() {
		var checked = 0;
		var result = false;
		_.forIn(props.traits, (trait: any, key: string) => {
			if (trait.maximum) {
				result =
					_.max(Object.values(props.stateTraits)) ===
					props.stateTraits[key];
			}
			if (
				props.stateTraits[key] <= trait.upper &&
				props.stateTraits[key] >= trait.lower
			) {
				checked++;
			}
		});
		if (checked === Object.values(props.stateTraits).length) {
			return true;
		} else {
			return (
				result && checked === Object.values(props.stateTraits).length
			);
		}
	}

	if (conditionalChecker()) {
		return (
			<div className="choice">
				<div className="title">{props.title}</div>
				<div className="paragraph choices-description">
					{props.description}
				</div>
				{props.data.map((choices: any) => (
					<Choice
						choices={choices.choices}
						maxChoice={choices.pick}
						description={choices.description}
						setState={() => {}}
						state={{}}
						title={choices.title}
					></Choice>
				))}
			</div>
		);
	} else {
		return <></>;
	}
}

export default Ending;
