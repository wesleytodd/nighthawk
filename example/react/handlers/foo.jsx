var React = require('react');

module.exports = function (req, res) {
	res.renderReactComponent(Page);
};

var Page = React.createClass({
	displayName: 'FooHandler',
	render: function () {
		return (
			<section>
				<h1>Foo Handler</h1>
				<a href="/">Home</a>
				<a href="/foo">Foo</a>
				<a href="/bar">Bar</a>
			</section>
		);
	}
});
