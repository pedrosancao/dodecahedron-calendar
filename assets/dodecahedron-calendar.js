(function(){
    var canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d'),
        lineSize, baseAngle, angle, radius, distanceOrigin, offset,
        font = ' Ubuntu, Arial, sans-serif';
    with (Math) {
        var pentagon = function(rotation) {
            for (var i = 1; i < 5; i++) {
                angle = PI/5 * (2 * i -rotation);
                ctx.lineTo(cos(angle) * radius, -sin(angle) * radius);
            }
            calendar(rotation);
        }
        , month = 0, date = new Date()
        , calendar = function(rotation) {
            var offsetX = -.55 * radius,
                offsetY = -.63 * radius,
                spaceX = -offsetX / 3,
                spaceY = 0,
                monthHolidays = holidays[date.getMonth()],
                holidayCount = monthHolidays.filter(function(value) {return value !== undefined;}).length,
                compare = new Date(date.getFullYear(), ++month),
                week = 'DSTQQSS',
                lines, text, i, weekday, day;
            lines = ceil(((compare.getTime() - date.getTime()) / 86400000 + date.getDay()) / 7) + holidayCount + 3.8;
            spaceY = 1.66 * radius / lines;
            // set position
            ctx.save();
            ctx.rotate((.1*PI) * (1 - 2 * rotation));
            // write month
            text = date.toLocaleString('pt-br', {month: 'short'}) + ' ' + date.getFullYear();
            text = text.charAt(0).toUpperCase() + text.substr(1);
            textCenter(text, 0, offsetY);
            // write weekday initials
            offsetY += 1.3 * spaceY;
            ctx.font = '10px' + font;
            for (i = 0; i < week.length; i++) {
                ctx.fillStyle = i === 0 ? '#f00' : '#000';
                textCenter(week.charAt(i), offsetX + i * spaceX, offsetY);
            }
            // write days
            offsetY += spaceY;
            while (date.getTime() < compare.getTime()) {
                weekday = date.getDay();
                day = date.getDate();
                ctx.fillStyle = (weekday === 0 || monthHolidays[day]) ? '#f00' : '#000';
                weekday === 0 && day !== 1 && (offsetY += spaceY);
                textCenter(day, offsetX + weekday * spaceX, offsetY);
                date.setDate(day + 1);
            }
            // write holidays
            offsetY += spaceY * 1.3;
            ctx.font = '9px' + font;
            ctx.fillStyle = '#000';
            for (i in monthHolidays) {
                textCenter(i + ' - ' + monthHolidays[i], 0, offsetY);
                offsetY += spaceY;
            }
            ctx.restore();
        }
        , holidays = (function () {
            var computus = function (year) {
                var table = [
                    [3, 14], [3,  3], [2, 23], [3, 11], [2, 31], [3, 18], [3,  8],
                    [2, 28], [3, 16], [3,  5], [2, 25], [3, 13], [3,  2], [2, 22],
                    [3, 10], [2, 30], [3, 17], [3,  7], [2, 27]
                ]
                , goldenN = year % 19
                , date = new Date(year, table[goldenN][0], table[goldenN][1])
                , dates = Array.apply(null, Array(12)).map(function(){return [];});
                date.setDate(date.getDate() + 7 - date.getDay());
                dates[date.getMonth()][date.getDate()] = ['Páscoa'];
                date.setDate(date.getDate() - 2);
                dates[date.getMonth()][date.getDate()] = ['Paixão de Cristo'];
                date.setDate(date.getDate() - 45);
                dates[date.getMonth()][date.getDate()] = ['Carnaval'];
                date.setDate(date.getDate() + 107);
                dates[date.getMonth()][date.getDate()] = ['Corpus Christi'];
                return dates;
            }
            , holidays = computus(date.getFullYear());
            holidays[0][1] = ['Confraternização mundial'];
            holidays[0][25] = ['Aniversário de São Paulo'];
            holidays[3][21] = ['Tiradentes'];
            holidays[4][1] = ['Dia do trabalho'];
            holidays[6][6] = ['Revolução de 1932'];
            holidays[8][7] = ['Independência do Brasil'];
            holidays[9][12] = ['Nossa Senhora Aparecida'];
            holidays[10][2] = ['Finados'];
            holidays[10][15] = ['Proclamação da República'];
            holidays[10][20] = ['Consciência negra'];
            holidays[11][25] = ['Natal'];
            return holidays;
        })()
        , textCenter = function(text, x, y) {
            ctx.fillText(text, x -ctx.measureText(text).width / 2, y);
        };
        date.setDate(1);
        date.setMonth(0);
        //date.setFullYear(2014);
        canvas.style.cssText = 'width: 273mm; height: 186mm'; // A4 -12mm margins 
        canvas.width = round(canvas.offsetWidth);
        canvas.height = round(canvas.offsetHeight);
        canvas.style.cssText = '';
        lineSize = round(canvas.width / 8.653);
        baseAngle = 2*PI/5;
        radius = sqrt(pow(lineSize, 2) / (pow(sin(baseAngle), 2) + pow(1 - cos(baseAngle), 2)));
        distanceOrigin = cos(PI/5) * radius * 2;
        offset = distanceOrigin + radius;
        ctx.save();
        ctx.translate(offset + 1, sin(3*PI/5) * offset + 1);
        for (var side = 0; side < 2; side++) {
            if (side) {
                baseAngle = -PI/5;
                ctx.save();
                ctx.translate((2 * cos(baseAngle) + cos(0)) * distanceOrigin, -(2 * sin(baseAngle) + sin(0)) * distanceOrigin);
            }
            ctx.beginPath();
            angle = PI/5 * -side;
            ctx.moveTo(cos(angle) * radius, -sin(angle) * radius);
            pentagon(side);
            for (var i = 0; i < 5; i++) {
                baseAngle = PI/5 * (2 * i - 1 - side);
                ctx.save();
                ctx.translate(cos(baseAngle) * distanceOrigin, -sin(baseAngle) * distanceOrigin);
                ctx.rotate(PI/5 * (5 - i * 2));
                pentagon(side);
                ctx.restore();
            }
            ctx.closePath();
            ctx.stroke();
        }
    }
})();