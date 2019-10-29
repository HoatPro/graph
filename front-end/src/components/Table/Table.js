import React from "react";
import PropTypes from 'prop-types';
import {Table, Pagination, Icon} from 'semantic-ui-react';
import _ from 'lodash';

class CustomTable extends React.Component {
    state = {
        firstDisabled: false,
        lastDisabled: false,
        nextDisabled: false,
        prevDisabled: false
    };

    componentWillReceiveProps=(nextProps)=> {
        const {paginationProps} = nextProps;
        const total = paginationProps.totalPages;
        const active = paginationProps.defaultActivePage;
        let result = {};

        if (total === 1) {
            result.firstDisabled = true;
            result.prevDisabled = true;
            result.lastDisabled = true;
            result.nextDisabled = true;
        } else {
            if (active === 1) {
                result.firstDisabled = true;
                result.prevDisabled = true;
                result.lastDisabled = false;
                result.nextDisabled = false;
            } else if (active === total) {
                result.lastDisabled = true;
                result.nextDisabled = true;
                result.firstDisabled = false;
                result.prevDisabled = false;
            } else {
                result.firstDisabled = false;
                result.prevDisabled = false;
                result.lastDisabled = false;
                result.nextDisabled = false;
            }
        }
        this.setState({...result});
    }

    render() {
        const {tableProps, header, body, pagination, paginationProps, columnCount, onPageChange} = this.props;
        let count = 0;
        const {firstDisabled, lastDisabled, nextDisabled, prevDisabled} = this.state;
        if (columnCount) {
            count = columnCount;
        } else {
            if (_.size(header) > 0) {
                count = header[0].length;
            }
        }
        const showEllipsis = paginationProps.totalPages > 1;
        return (
            <Table {...tableProps}>
                <Table.Header>
                    {header.map((r, i) => {
                        return (<Table.Row key={i}>
                            {r.map((c, _i) => {
                                let cell = '';
                                let props = {};
                                if (_.isString(c) || _.isNumber(c)) {
                                    cell = c;
                                } else {
                                    if (_.isNull(c)) {
                                        cell = '';
                                    } else if (c.cell) {
                                        props = c.props || {};
                                        cell = c.cell;
                                    } else {
                                        cell = c;
                                    }
                                }
                                return (<Table.HeaderCell {...props} key={_i}>
                                    {cell}
                                </Table.HeaderCell>);
                            })}
                        </Table.Row>);
                    })}
                </Table.Header>
                <Table.Body>
                    {body.map((r, i) => {
                        return (<Table.Row key={i}>
                            {r.map((c, _i) => {
                                let cell = '';
                                let props = {};
                                if (_.isString(c) || _.isNumber(c)) {
                                    cell = c;
                                } else {
                                    if (_.isNull(c) || _.isUndefined(c)) {
                                        cell = '';
                                    } else if (c.cell) {
                                        props = c.props || {};
                                        cell = c.cell;
                                    } else {
                                        cell = c;
                                    }
                                }
                                return (<Table.Cell {...props} key={_i}>
                                    {cell}
                                </Table.Cell>);
                            })}
                        </Table.Row>);
                    })}
                </Table.Body>
                <Table.Footer fullWidth>
                    <Table.Row>
                        <Table.HeaderCell colSpan={count}>

                            {pagination ?
                                <Pagination
                                    size='mini'
                                    floated='right'
                                    defaultActivePage={paginationProps.defaultActivePage}
                                    ellipsisItem={showEllipsis ? {
                                        content: <Icon name='ellipsis horizontal'/>,
                                        icon: true
                                    } : null}
                                    firstItem={{
                                        disabled: firstDisabled,
                                        content: <Icon name='angle double left'/>,
                                        icon: true
                                    }}
                                    lastItem={{
                                        disabled: lastDisabled,
                                        content: <Icon name='angle double right'/>,
                                        icon: true
                                    }}
                                    prevItem={{disabled: prevDisabled, content: <Icon name='angle left'/>, icon: true}}
                                    nextItem={{disabled: nextDisabled, content: <Icon name='angle right'/>, icon: true}}
                                    totalPages={paginationProps.totalPages || 1}
                                    siblingRange={1}
                                    onPageChange={onPageChange}

                                /> : ''
                            }
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>);
    }
}

CustomTable.defaultProps = {
    header: [],
    body: [],
    tableProps: {celled: true, selectable: true},
    pagination: true,
    paginationProps: {
        defaultActivePage: 1,
        totalPages: 1
    },
    onPageChange: () => {
    }
};

CustomTable.propTypes = {
    header: PropTypes.arrayOf(PropTypes.array).isRequired,
    body: PropTypes.array.isRequired,
    tableProps: PropTypes.object,
    pagination: PropTypes.bool,
    paginationProps: PropTypes.object,
    columnCount: PropTypes.number,
    onPageChange: PropTypes.func
};

export default CustomTable;