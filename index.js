
module.exports = function antiCC(mod) {
	let location = null;
	let locationTime = 0;

	mod.command.add("cc", () => {
		mod.settings.enabled = !mod.settings.enabled;
		mod.command.message(`Module ${mod.settings.enabled ? "<font color='#00ff00'>enabled</font>" : "<font color='#ff0000'>disabled</font>"}`);
	});

	mod.game.me.on("change_zone", () => {
		if (!mod.game.me.inOpenWorld) {
			mod.command.message(`Module ${mod.settings.enabled ? "<font color='#00ff00'>enabled</font>" : "<font color='#ff0000'>disabled</font>"}`);
		}
	});

	mod.hook("C_PLAYER_LOCATION", 5, { "order": Infinity }, event => {
		location = event;
		locationTime = Date.now();
	});

	mod.hook("S_EACH_SKILL_RESULT", 13, { "order": -Infinity }, event => {
		if (!mod.settings.enabled) return;

		if (mod.game.me.is(event.target) && event.reaction.enable) {
			if (!event.reaction.push) {
				mod.send("C_PLAYER_LOCATION", 5, {
					...location,
					"type": 2,
					"time": location.time - locationTime + Date.now() - 50
				});

				mod.send("C_PLAYER_LOCATION", 5, {
					...location,
					"type": 7,
					"time": location.time - locationTime + Date.now() + 50
				});
			}

			Object.assign(event.reaction, {
				"enable": false,
				"push": false,
				"air": false,
				"airChain": false
			});

			return true;
		}
	});
};