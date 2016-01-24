var React = require('react');

module.exports = function (req, res) {
	res.renderReactComponent(Page, res.locals);
};

var Page = React.createClass({
	displayName: 'IndexHandler',
	render: function () {
		return (
			<section>
				<h1>Index Handler</h1>
				<a href="/">Home</a>
				<a href="/foo">Foo</a>
				<a href="/bar">Bar</a>
			</section>
		);
	}
});
