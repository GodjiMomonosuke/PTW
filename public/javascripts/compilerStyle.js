var code = document.getElementById('code');
    var lineCounter = document.getElementById('lineCounter');
 
             var lineCountCache = 0;
             function line_counter() {
                 var lineCount = code.value.split('\n').length;
                 var outarr = new Array();
                 if (lineCountCache != lineCount) {
                     for (var x = 0; x < lineCount; x++) {
                         outarr[x] = (x + 1)+' ';
                     }
                     lineCounter.value = outarr.join('\n');
                 }
                 lineCountCache = lineCount;
             }
 
             code.addEventListener('scroll', () => {
                 lineCounter.scrollTop = code.scrollTop;
                 lineCounter.scrollLeft = code.scrollLeft;
             });
 
             code.addEventListener('input', () => {
                 line_counter();
             });
 
             code.addEventListener('keydown', (e) => {
                 let { keyCode } = e;
                 let { value, selectionStart, selectionEnd } = code;
 
                 if (keyCode === 9) {  // TAB = 9
                   e.preventDefault();
                   code.value = value.slice(0, selectionStart) + '\t' + value.slice(selectionEnd);
                   code.setSelectionRange(selectionStart+2, selectionStart+2)
                 }
               });
 
               code.value = htmlTemplateStr;
               line_counter();
