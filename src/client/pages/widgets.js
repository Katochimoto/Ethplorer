import $ from 'jquery'
import widget from 'ethplorer-widget'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai.css'

const CODE = {
  'ethplorer-textarea-1': `<div id="token-history-grouped-1"></div>
<script type="text/javascript">
if (typeof (eWgs) === 'undefined') {
    document.write('<scr' + 'ipt src="https://api.ethplorer.io/widget.js?' + new Date().getTime().toString().substr(0, 7) + '" async></scr' + 'ipt>');
    var eWgs = [];
}
eWgs.push(function () {
    ethplorerWidget.init(
        '#token-history-grouped-1', // Placeholder element
        'tokenHistoryGrouped', // Widget type
        {
            // token address
            'address': '0xe94327d07fc17907b4db788e5adf2ed424addff6',
            options: {
                'title': 'Augur Rep Token Pulse',
                'pointSize': 5,
                'vAxis': {
                    'title': 'Token operations',
                }
            }
        }

    );
});
</script>`,

  'ethplorer-textarea-2': `<div id="token-history-grouped-2"></div>
<script type="text/javascript">
    if (typeof (eWgs) === 'undefined') {
        document.write('<scr' + 'ipt src="https://api.ethplorer.io/widget.js?' + new Date().getTime().toString().substr(0, 7) + '" async></scr' + 'ipt>');
        var eWgs = [];
    }
    eWgs.push(function () {
        ethplorerWidget.init(
            '#token-history-grouped-2', // Placeholder element
            'tokenHistoryGrouped', // Widget type
            {
                'period': 90,
                'type': 'column', // supported types: area, column, line
                options: {
                    'title': 'Ethereum Tokens Pulse',
                    'pointSize': 2,
                    'hAxis': {
                        'title': '90 days token operations chart',
                        'titleTextStyle': {
                            'color': '#3366CC',
                            'italic': true
                        }
                    },
                    'vAxis': {
                        'title': 'Token operations',
                    }
                }
            }

        );
    });
</script>`,

  'ethplorer-textarea-3': `<div id="token-history-grouped-3"></div>
<script type="text/javascript">
    if (typeof (eWgs) === 'undefined') {
        document.write('<scr' + 'ipt src="https://api.ethplorer.io/widget.js?' + new Date().getTime().toString().substr(0, 7) + '" async></scr' + 'ipt>');
        var eWgs = [];
    }
    eWgs.push(function () {
        ethplorerWidget.init(
            '#token-history-grouped-3', // Placeholder element
            'tokenHistoryGrouped', // Widget type
            {
                'period': 90,
                'theme': 'dark',
                options: {
                    'pointSize': 1,
                    'title': 'Ethereum Tokens Pulse',
                    'hAxis': {
                        'title': '90 days token operations chart',
                    },
                    'vAxis': {
                        'title': 'Token operations',
                    }
                }
            }
        );
    });
</script>`,

  'ethplorer-textarea-10': `<div id="token-txs-10"></div>
<script type="text/javascript">
    if (typeof (eWgs) === 'undefined') {
        document.write('<scr' + 'ipt src="https://api.ethplorer.io/widget.js?' + new Date().getTime().toString().substr(0, 7) + '" async></scr' + 'ipt>');
        var eWgs = [];
    }
    eWgs.push(function () {
        ethplorerWidget.init(
            '#token-txs-10', // Placeholder element
            'tokenHistory', // Widget type
            {
                address: '0xe94327d07fc17907b4db788e5adf2ed424addff6', // keep empty to show all tokens
                limit: 5, // Number of records to show
            }

        );
    });
</script>`,

  'ethplorer-textarea-11': `<style>
    #token-txs-11 {
        line-height: 1.8;
        border-radius: 8px;
        max-width: 700px !important;
        background-blend-mode: darken;
        background-color: rgba(21,12,70,0.9);
    }
    #token-txs-11 .txs.big-screen-table td .tx-amount{
        display: inline-block;
        width: 150px;
        white-space: nowrap;
    }
    #token-txs-11 .txs.big-screen-table td .tx-link{
        max-width: 120px;
    }
    #token-txs-11 .txs.big-screen-table td .tx-link:last-child{
        max-width: 150px;
    }
    #token-txs-11 .txs.big-screen-table td .tx-amount a:nth-child(1){
        max-width: 110px !important;
    }
    #token-txs-11 .txs.big-screen-table td .tx-amount  a:nth-child(2){
        max-width: 50px !important;
    }
</style>
<div id="token-txs-11"></div>
<script type="text/javascript">
    if (typeof (eWgs) === 'undefined') {
        document.write('<scr' + 'ipt src="https://api.ethplorer.io/widget.js?' + new Date().getTime().toString().substr(0, 7) + '" async></scr' + 'ipt>');
        var eWgs = [];
    }
    eWgs.push(function () {
        ethplorerWidget.init(
            '#token-txs-11', // Placeholder element
            'tokenHistory', // Widget type
            {
                address: '0xe94327d07fc17907b4db788e5adf2ed424addff6', // keep empty to show all tokens
                limit: 5, // Number of records to show
            },
            {
                header: '<div class="txs-header">WETH Recent Transactions</div>', // customized header
                loader: '<div class="txs-loading">* L * O * A * D * I * N * G *<br><small>Please wait...</small></div>', // customized loader
                bigScreenTable: '<tr><td>%from% <span class="tx-send">sent</span> <span class="tx-amount">%amount% %token%</span> <span class="tx-send">to</span> %to% <span class="tx-send">at</span><span class="tx-date"> %datetime%</span></td></tr>'

            }
        );
    });
</script>`,

  'ethplorer-textarea-12': `<div id="token-txs-12"></div>
<script type="text/javascript">
    if (typeof (eWgs) === 'undefined') {
        document.write('<scr' + 'ipt src="https://api.ethplorer.io/widget.js?' + new Date().getTime().toString().substr(0, 7) + '" async></scr' + 'ipt>');
        var eWgs = [];
    }
    eWgs.push(function () {
        ethplorerWidget.init(
            '#token-txs-12', // Placeholder element
            'topTokens', // Widget type
            {
                limit: 10, // Number of records to show
                period: 30 // period of calculating
            }

        );
    });
</script>`,
}

$(function () {
  widget.init(
    '#token-history-grouped-1', // Placeholder element
    'tokenHistoryGrouped', // Widget type
    {
      // token address
      'address': '0xe94327d07fc17907b4db788e5adf2ed424addff6',
      options: {
        'title': 'Augur Rep Token Pulse',
        'pointSize': 5,
        'vAxis': {
          'title': 'Token operations',
        }
      }
    }
  )

  widget.init(
    '#token-history-grouped-2', // Placeholder element
    'tokenHistoryGrouped', // Widget type
    {
      'period': 90,
      'type': 'column', // supported types: area, column, line
      options: {
        'title': 'Ethereum Tokens Pulse',
        'pointSize': 2,
        'hAxis': {
          'title': '90 days token operations chart',
          'titleTextStyle': {
            'color': '#3366CC',
            'italic': true
          }
        },
        'vAxis': {
          'title': 'Token operations',
        }
      }
    }
  )

  widget.init(
    '#token-history-grouped-3', // Placeholder element
    'tokenHistoryGrouped', // Widget type
    {
      'period': 90,
      'theme': 'dark',
      options: {
        'pointSize': 1,
        'title': 'Ethereum Tokens Pulse',
        'hAxis': {
          'title': '90 days token operations chart',
        },
        'vAxis': {
          'title': 'Token operations',
        }
      }
    }
  )

  widget.init(
    '#token-txs-10', // Placeholder element
    'tokenHistory', // Widget type
    {
      address: '0xe94327d07fc17907b4db788e5adf2ed424addff6', // keep empty to show all tokens
      limit: 5, // Number of records to show
    }
  )

  widget.init(
    '#token-txs-11', // Placeholder element
    'tokenHistory', // Widget type
    {
      address: '0xe94327d07fc17907b4db788e5adf2ed424addff6', // keep empty to show all tokens
      limit: 5, // Number of records to show
    },
    {
      header: '<div class="txs-header">WETH Recent Transactions</div>', // customized header
      loader: '<div class="txs-loading">* L * O * A * D * I * N * G *<br><small>Please wait...</small></div>', // customized loader
      bigScreenTable: '<tr><td>%from% <span class="tx-send">sent</span> <span class="tx-amount">%amount% %token%</span> <span class="tx-send">to</span> %to% <span class="tx-send">at</span><span class="tx-date"> %datetime%</span></td></tr>'
    }
  )

  widget.init(
    '#token-txs-12', // Placeholder element
    'topTokens', // Widget type
    {
      limit: 10, // Number of records to show
      period: 30 // period of calculating
    }
  )

  widget.loadScript('https://www.gstatic.com/charts/loader.js', widget.loadGoogleCharts)

  $(document).on('click', 'button[data-code]', event => {
    const key = $(event.target).data('code')
    const description = $(event.target).data('description')
    const $code = $('#dialog-editor-code')

    $code.text(CODE[key])
    hljs.highlightBlock($code[0])
    $('#dialog-editor-descr').text(description).toggle(!!description)
    $('#dialog-editor').modal('show')
  })
})
