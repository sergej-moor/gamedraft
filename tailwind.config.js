/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [],
	theme: {
		colors: {
			gray: {
				800: "#171617",
				700: "#2D2D31",
				600: "#262526",
				400: "#333333",
				200: "#454546",
				100: "#6d6d6d",
			},

			white: "#E4E3ED",
		},

		borderRadius: {
			DEFAULT: "1rem",
		},

		extend: {},
	},
	plugins: [require("@tailwindcss/typography")],
};
