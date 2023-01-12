import React from 'react';
import Highcharts from 'highcharts';

class BarTotal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            series: [
                {
                    name: props.type[0].toUpperCase() + props.type.substring(1),
                    data: props.state[props.type],
                },
            ],
        };
    }

    highChartsRender() {
        Highcharts.chart('chart-dashboard-' + this.props.type, {
            chart: {
                type: 'column',
            },
            title: {
                text: `Number of ${this.props.type} created by month`,
            },

            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                crosshair: true,
            },
            yAxis: {
                min: 0,
                title: {
                    text: '',
                },
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                    '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0">&nbsp<b>{point.y:.0f}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true,
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                },
            },
            series: this.state.series,
        });
    }

    componentDidMount() {
        this.highChartsRender();
    }

    render() {
        return <div className="mt-5" id={'chart-dashboard-' + this.props.type}></div>;
    }
}
export default BarTotal;
