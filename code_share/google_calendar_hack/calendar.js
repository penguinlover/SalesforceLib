var status = 'idel';
var firstPick = null,
    lastPick = null,
    firstIdx = null,
    lastIdx = null;

function enableAllEvents(){
    $('#datepicker .dates td:not(.mon)').on('click', function(){
        if(status == 'idel'){
            firstPick = $(this);
            firstIdx = firstPick.parent()[0].sectionRowIndex;
            status = 'selecting';
            firstPick.addClass('selected');
            enableSelect();
        } else if (status == 'selecting') {
            status = 'idel';
            finishSelect();
        } else {
            alert("OMG!");
        }
    });
    $('td#up').on('click', function(){
        $('#test tbody tr').remove();
        $('#dates').val('');
        renderPrev();
    });
    $('td#down').on('click', function(){
        $('#dates').val('');
        $('#test tbody tr').remove();
        renderNext();
    });
}

function enableSelect(){
    $('#datepicker .dates td:not(.mon)').on('mouseenter', function(){
        lastPick = $(this);
        console.log(lastPick.data('date'));
        // eager rendering
        $('#datepicker .dates td.selected').removeClass('selected');
        firstPick.addClass('selected');
        lastPick.addClass('selected');
        // only when selecting multiple days
        if(firstPick[0] != lastPick[0]){
            lastIdx = lastPick.parent()[0].sectionRowIndex;
            if(firstIdx == lastIdx){
                if(firstPick.data('date').d > lastPick.data('date').d){
                    fillGap(lastPick, firstPick);
                } else {
                    fillGap(firstPick, lastPick);
                }
            } else if (firstIdx > lastIdx) {
                fillGap(lastPick, firstPick, lastIdx, firstIdx);
            } else {
                fillGap(firstPick, lastPick, firstIdx, lastIdx);
            }
        }

    });
}

function finishSelect(){
    $('#datepicker .dates td').off('mouseenter');
    // write down dates
    var f_tmp = firstPick.data('date'),
        l_tmp = lastPick.data('date'),
        startDate = new Date(f_tmp.y, f_tmp.m, f_tmp.d),
        endDate = new Date(l_tmp.y, l_tmp.m, l_tmp.d);
    if(startDate > endDate){
        startDate = [endDate, endDate = startDate][0]; //one-liner swap... in future maybe [a, b] = [b, a]
    }
    $('input#dates').val( (startDate.getMonth()+1) + '/' + startDate.getDate() + '/' + startDate.getFullYear() 
                         + ' - ' + (endDate.getMonth()+1) + '/' + endDate.getDate() + '/' + endDate.getFullYear());
    //clear selections
    $('#datepicker .dates td.selected').removeClass('selected');
    firstPick, lastPick, firstIdx, lastIdx = null;
}

function fillGap(firstDate, lastDate, firstRow, lastRow){
    if (firstRow != undefined && lastRow != undefined){
        firstDate.nextAll().addClass('selected');
        lastDate.prevAll().addClass('selected');
        if(lastRow - firstRow > 1){
            for(var i = 1; i < lastRow - firstRow; i++){
                var j = firstRow + i;
                $('.dates tr:eq(' + j + ')').find('td').addClass('selected');
            }
        }
    } else {
        firstDate.nextUntil(lastDate).each(function(){
            $(this).addClass('selected');
        });
    }
}
//////////////////////
// core functions

// constants
var Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept','Oct', 'Nov', 'Dec'];
var DaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var CurrentDate = new Date().getDate();
var CurrentMonth = new Date().getMonth();
var CurrentYear = new Date().getFullYear();

var baseMonth = CurrentMonth,
    baseYear = CurrentYear;
var dates = [];

function initialize(){
    // for initialization only
    var params = [[baseYear, baseMonth]];
    for(var i=0; i<2; i++){
        if(++baseMonth > 11){
            baseMonth %= 12;
            baseYear++;
        }
        params.push([baseYear, baseMonth]);
    }
    for(var j=0; j < params.length; j++){
        dates.push(getCalendarInfo(params[j][0], params[j][1]));
    }
    renderView(dates);
}

// shift + push
function renderNext(){
    baseMonth = dates[2][1];
    baseYear = dates[2][0]; 
    dates.shift();
    if(++baseMonth > 11){
        baseMonth %= 12;
        baseYear++;
    }
    dates.push(getCalendarInfo(baseYear, baseMonth));
    renderView(dates);
}

// pop + unshift
function renderPrev(){
    baseMonth = dates[0][1];
    baseYear = dates[0][0];
    dates.pop();
    if(--baseMonth < 0){
        baseMonth = 11;
        baseYear--;
    }
    dates.unshift(getCalendarInfo(baseYear, baseMonth));
    renderView(dates);
}

// returns [year, month, numOfDays, weekStartOn]
function getCalendarInfo(year, month){
    var date = new Date(),
        numOfDays = 0,
        weekStartOn = 0;
    date.setYear(year);
    date.setMonth(month);
    numOfDays = (isLeapYear(year) && month == 1) ? 29 : DaysInMonth[month];
    date.setDate(1);
    weekStartOn = date.getDay();
    return [year, month, numOfDays, weekStartOn];
}

function isLeapYear(year){
    return (year % 100 != 0 && year % 4 == 0) || (year % 400 == 0);
}

// let's hope
function renderView(data){
    // render days from previous month if there is any
    var result = [],
        $nextRow = null;
    
    for(var j=0; j < data.length; j++){
        var weekStartOn = data[j][3],
            month = data[j][1],
            year = data[j][0],
            numOfDays = data[j][2];
        //console.log('weekStartOn:' + weekStartOn + '. numOfDays:' + numOfDays);
        // render the first row
        if(!$nextRow){
            $nextRow = $('<tr>');
            var daysInPrevMonth,
                _month = month,
                _year = year;
            if(--_month < 0) { _year--; _month = 11; }
            daysInPrevMonth = (isLeapYear(_year) && _month == 1) ? 29 : DaysInMonth[_month];
            //console.log('daysInPrevMonth:' + daysInPrevMonth);
            for(var i=0; i < weekStartOn; i++){
                var node = $('<td class="before but err">' + daysInPrevMonth-- + '</td>');
                if(i == weekStartOn - 1){ node.addClass('wal'); }
                node.data('date', {y: _year, m: _month, d: daysInPrevMonth})
                $nextRow.append(node);
            }
            //console.log('firstRow:first' + $nextRow.html());
        }
        // render the rest of first row
        var d = 1;
        for(var i=weekStartOn; i <= 7; i++, d++){
            var node = $('<td class="cap">' + d + '</td>');
            if(i == 7){ 
                node.addClass('mon bug').text(Months[data[j][1]]); 
            }
            node.data('date', {y: year, m: month, d: d});
            $nextRow.append(node);
        }
        //console.log('firstRow.all:' + $nextRow.html());
        result.push($nextRow);
        
        // render the rest rows
        $nextRow = $('<tr>');
        var base = --d;
        for(d; d <= numOfDays; d++){
            //console.log('base:' + base + 'd:' + d + 'numOfDays:' + numOfDays);
            if(d > base && (d - base) % 7 == 0){
                result.push($nextRow);
                //console.log($nextRow.html());
                $nextRow = $('<tr>');
            }
            var node = $('<td>' + d + '</td>');
            if(j < data.length - 1){            
                if(numOfDays - d < (numOfDays - (7 - weekStartOn)) % 7){
                    node.addClass('but');
                    if(numOfDays == d){ node.addClass('wal'); }
                }
            }
            node.data('date', {y: year, m: month, d: d});
            $nextRow.append(node);
        }
        result.push($nextRow);
    }
    for(var i=0; i< result.length; i++){
        $('#test tbody').append(result[i]);
    }
    enableAllEvents();
}

initialize();
