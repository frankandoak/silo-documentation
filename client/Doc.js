;
const React = require('react');
const {Grid,Row,Col,Breadcrumb} = require('react-bootstrap');
const marked = require('marked');

module.exports = React.createClass({

    propTypes: {
        page: React.PropTypes.string.isRequired,
        basePath: React.PropTypes.string.isRequired
    },

    getInitialState: function(){
        return {
            content: "",
            renderer: null
        };
    },

    componentDidMount: function(){
        let page = this.props.page ? this.props.page : "";
        let basePath = this.props.basePath;
        let renderer = new marked.Renderer();
        renderer.link = function(href, title, text) {
            let out = '<a';
            if (href.indexOf('http') === 0) {
                out += ' href="' + href + '"';
            } else {
                if (text.startsWith('&gt;')) {
                    out += ' target="_blank" href="/#!'+ href +'"';
                } else {
                    let link = page+href.replace(/\.md/i, '');
                    out += ' href="#'+basePath+link+'"';
                }
            }
            if (title) {
                out += ' title="' + title + '"';
            }
            out += '>' + text + '</a>';
            return out;
        };
        renderer.image = function(href, title, text) {
            let out = '<img src="/silo/doc' + page+'/'+href + '" class="img-thumbnail img-responsive center-block"' +
                ' alt="' + text + '"';
            if (title) {
                out += ' title="' + title + '"';
            }
            out += this.options.xhtml ? '/>' : '>';
            return out;
        };
        renderer.table = function(header, body) {
            return '<table class="table table-bordered">\n'
                + '<thead>\n'
                + header
                + '</thead>\n'
                + '<tbody>\n'
                + body
                + '</tbody>\n'
                + '</table>\n';
        };

        $.ajax(
            "/silo/doc"+page,
            {
                success: function(data){
                    this.setState({
                        content: data.content,
                        renderer: renderer
                    });
                }.bind(this),
                headers: {'Accept': 'application/json'}
            }
        );
    },

    render: function(){
        let breadcrumbs = [];
        if (this.props.page && this.props.page.length){
            this.props.page.substr(1).split('/').forEach((p, k)=>{
                let last = k - 1 >= 0 ? breadcrumbs[k-1].url:"";
                breadcrumbs.push({url:last+'/'+p, name:p});
            });
            breadcrumbs.pop();
        }

        return (
            <Grid>
                <Row>
                    <Col xs={12} md={8} mdOffset={2}>

                        <Breadcrumb>
                            <Breadcrumb.Item href="#!/doc">
                                Doc Home
                            </Breadcrumb.Item>
                            {breadcrumbs.map((breadcrumb)=><Breadcrumb.Item key={breadcrumb.name} onClick={()=>{A.Page.Open('!/doc'+breadcrumb.url);}}>
                                {breadcrumb.name[0].toUpperCase()+breadcrumb.name.substr(1)}
                            </Breadcrumb.Item>)}
                        </Breadcrumb>

                        <div className="documentation-container">
                            <div dangerouslySetInnerHTML={{
                                __html: marked(this.state.content, {renderer:this.state.renderer})
                            }} />
                        </div>

                    </Col>
                </Row>
            </Grid>

        );
    }
});
