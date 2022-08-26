import React from "react";
import "./styles/isekai.css";
import Choice from "./components/choice";
import data from "./data/isekai.json";
import Paragraph from "./components/paragraph";
import { useState } from "react";
import Ending from "./components/ending";
import _ from "lodash";
import Photopara from "./components/photopara";

function App() {
	var traitsRaw: any[] = [];
	var traits: any[] = [];
	function initialStateSet(data: any[]) {
		var initialState = {};
		data.forEach((component) => {
			if (component.type === "choice" && component.choices) {
				_.set(initialState, component.title, []);
				component.choices.forEach((choice: any) => {
					if (choice.modifier !== "") {
						choice.modifier
							.match(/\b[^\d\W]+\b/g)
							.forEach((trait: string) => {
								traitsRaw.push(trait);
							});
					}

					// choice.modifier
					// 	.match(/\b[^\d\W]+\b/g)
					// 	.forEach((trait: string) => {
					// 		traitsRaw.push(trait);
					// 	});
				});
			}
		});
		traits = [...new Set(traitsRaw)];
		traits.forEach((trait) => {
			_.set(initialState, trait, 0);
		});
		return initialState;
	}

	function conditionParser(condition?: {
		conditional: string;
		a: string;
		b: any;
	}) {
		if (condition) {
			var aArray = condition.a.split(".");
			var a: any;
			if (gameState[aArray[0]] && aArray[1]) {
				a = [];
				gameState[aArray[0]].forEach((celeb: any) => {
					a.push(celeb[aArray[1]]);
				});
			} else if (gameState[aArray[0]]) {
				a = gameState[aArray[0]];
			} else {
				a = "";
			}
			return {
				conditional: condition.conditional,
				a: a,
				b: condition.b,
			};
		} else return null;
	}

	var stateTraits = {};

	const [gameState, setGameState] = useState(initialStateSet(data.data));
	traits.forEach((trait) => {
		_.set(stateTraits, trait as string, gameState[trait]);
	});

	return (
		<React.Fragment>
			<main>
				<div>
					<div className="main-title">{data.title}</div>
					<div className="paragraph">{data.description}</div>
				</div>
				{data.data.map((component) => {
					if (component.type === "choice" && component.choices) {
						return (
							<Choice
								title={component.title}
								choices={component.choices}
								description={component.description}
								maxChoice={component.pick}
								condition={conditionParser(component.condition)}
								state={gameState}
								setState={setGameState}
							></Choice>
						);
					} else if (
						component.type === "paragraph" &&
						typeof component.description !== "string"
					) {
						return (
							<Paragraph
								title={component.title}
								description={component.description}
							></Paragraph>
						);
					} else if (
						component.type === "photopara" &&
						typeof component.description !== "string"
					) {
						return (
							<Photopara
								title={component.title}
								condition={conditionParser(component.condition)}
								celeb={component.celeb}
								description={component.description}
							></Photopara>
						);
					} else if (
						component.type === "ending" &&
						typeof component.description === "string" &&
						component.traits &&
						component.data
					) {
						return (
							<Ending
								title={component.title}
								description={component.description}
								traits={component.traits}
								data={component.data}
								stateTraits={stateTraits}
							></Ending>
						);
					} else {
						return <></>;
					}
				})}
			</main>
			<div className="traits">
				{traits.map((trait: any) => (
					<p>{trait + " : " + gameState[trait]}</p>
				))}
			</div>
		</React.Fragment>
	);
}

export default App;
