var React = require('react');

module.exports = function (req, res) {
	res.renderReactComponent(Page);
};

var Page = React.createClass({
	displayName: 'BarHandler',
	render: function () {
		return (
			<section>
				<h1>Bar Handler</h1>
				<a href="/">Home</a>
				<a href="/foo">Foo</a>
				<a href="/bar">Bar</a>
			</section>
		);
	}
});
