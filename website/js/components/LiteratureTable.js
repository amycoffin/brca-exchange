'use strict';

const React = require('react'),
    { Link } = require('react-router'),
    { Grid, Row, Col, Table, OverlayTrigger, Popover, ButtonToolbar, Button, DropdownButton, Badge} = require('react-bootstrap'),
    backend = require('../backend');

// Sort first by year, then by PMID (as a proxy for a more specific date of publication?)
const pubsOrdering = function(pub1, pub2) {
    if (isNaN(pub1.year)) {
        return 1;
    }
    if (isNaN(pub2.year)) {
        return -1;
    }
    if (pub2.year - pub1.year !== 0) {
        return pub2.year - pub1.year;
    }
    if (pub2.pmid - pub1.pmid !== 0) {
        return pub2.pmid - pub1.pmid;
    }
    return 1;
};

const fakeLit = require('./fakepubs.js').sort(pubsOrdering);

function limitFieldLength(string, maxLength) {
    if (string.length <= maxLength) {
        return string;
    }

    let popper = (<Popover>{string}</Popover>);
    return (
        <span>
            {string.substring(0, maxLength)}
            <OverlayTrigger placement='bottom' overlay={popper}><span>...</span></OverlayTrigger>
        </span>
    );
}

function limitAuthorCount(authors, maxCount) {
    let popper = (<Popover>{authors.split(";").map(e => [e, <br />])}</Popover>);
    let auth = authors.split(";")
    return (
        <span>
            { auth.slice(0, maxCount).join(";") }
            { auth.length > maxCount ?
                (<OverlayTrigger placement='bottom' overlay={popper}><span>... (more)</span></OverlayTrigger>)
                : null
            }
        </span>
    );
}

function formatKeywords(keywords) {
    let kw = keywords.split(",").map(e => e.split("/").join("\n/\n"));
    return (
        <ul className="keywords">{kw.map(e => <li><Badge className="info">{e}</Badge></li>)}</ul>
    );
}

class LiteratureTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        if (!this.props.variant) {
            backend.variant(this.props.params.id).subscribe(
                resp => {
                    return this.setState({data: resp.data, error: null});
                },
                () => { this.setState({error: 'Problem connecting to server'}); }
            );
        }
    }

    toTSV() {
        return fakeLit.map(({title, authors, journal, year, keywords, pmid}) =>
            [title, authors, journal, year, keywords, pmid].join("\t")).join("\n");
    }

    toJSON() {
        return JSON.stringify(fakeLit);
    }

    copyTable() {
        let textarea = this.refs.clipboardContent.getDOMNode();
        textarea.value = this.toTSV();
        textarea.select();
        document.execCommand('copy');
    }

    render() {
        if (!this.props.variant && !this.state.data) {
            return (<div />);
        }
        let litRows = fakeLit;
        if (this.props.maxRows) {
            litRows = litRows.slice(0, this.props.maxRows);
        }
        litRows = litRows.map(({title, authors, journal, year, keywords, pmid}) => (
            <li>
                <div className="literature-right-pane">
                    <small className="pmid">PMID<a href={`https://www.ncbi.nlm.nih.gov/pubmed/${pmid}`} target='_blank'>{pmid}</a></small>
                    <div>{year}</div>
                    <div>{journal}</div>
                </div>
                <b>{title}</b>
                <div>{limitAuthorCount(authors, 3)}</div>
                { keywords.length ? (
                    <div>
                        Keywords:
                        {formatKeywords(keywords, 5)}
                    </div>
                ) : null }
                <hr />
            </li>
        ));
        let toTSVURL = `data:text/tab-separated-values;charset=utf-8,${encodeURIComponent(this.toTSV())}`;
        let toJSONURL = `data:text/json;charset=utf-8,${encodeURIComponent(this.toJSON())}`;
        let component = (
            <div>
                <h4>Literature Search Results (alternate style):</h4>
                    <ul>
                    {litRows}
                    </ul>
                    { fakeLit.length > this.props.maxRows
                        ? ( <div style={{textAlign: "center"}}>
                                <Link to={`/variant_literature/${this.props.variant.id}`}>
                                    View {`${fakeLit.length - this.props.maxRows}`} more publications...
                                </Link>
                            </div>
                        ) : null
                    }
                <ButtonToolbar className='pull-right'>
                    <Button onClick={this.copyTable.bind(this)}>Copy To Clipboard</Button>
                    <DropdownButton title="Export">
                        <li><a href={toTSVURL} download='variant-literature.tsv'>tsv</a></li>
                        <li><a href={toJSONURL} download='variant-literature.json'>json</a></li>
                    </DropdownButton>
                </ButtonToolbar>
                <textarea ref='clipboardContent' style={{padding: '0', width: '0', height: '0', marginLeft: '-99999999px' }}/>
            </div>
        );

        if (this.props.variant) {
            return component;
        } else {
            return (
                <Grid>
                    <Row>
                        <Col md={12} className="variant-literature-col">
                            <h3>{this.state.data[0]["HGVS_cDNA"]}</h3>
                            {component}
                        </Col>
                    </Row>
                </Grid>
            );
        }
    }
}

export default LiteratureTable;
