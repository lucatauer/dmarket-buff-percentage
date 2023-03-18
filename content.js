chrome.runtime.sendMessage('getData', data => {
    function addBuffPercentage() {
        console.log('addBuffPercentage called');
    
        if (!data) {
            console.log('Data not available');
            return;
        }
    
        const images = document.querySelectorAll('img');
    
        // loop through each image
        images.forEach(image => {
            
            const altText = image.getAttribute('alt');

            if (data[altText]) {
            
                // find the grandparent of the image
                const grandparent = image.parentElement.parentElement;

                // find the last div with class "c-asset__header" before the grandparent element
                let prevDiv = grandparent.previousElementSibling;
                while (prevDiv && !prevDiv.classList.contains('c-asset__header')) {
                    prevDiv = prevDiv.previousElementSibling;
                }

                let p = prevDiv.querySelector('.buff-percentage');

                if (!p) {
                    // create a new paragraph and add it to the div
                    p = document.createElement('p');
                    p.classList.add('buff-percentage');
                    prevDiv.appendChild(p);
                }
                
                let dmarketPrice;

                try {
                    dmarketPrice = parseFloat(prevDiv.innerText.match(/\$((\d\s)?\d{1,3}(\.\d{2})?)/)[1].replace(/\s/g, ''));
                }
                catch(error) {
                
                }
                
                const price = data[altText].USD;
                let buffPercentage = (dmarketPrice / price) * 100;
                p.textContent = buffPercentage.toFixed(2);
            
                if (buffPercentage >= 100) {
                    p.classList.add('red');
                    p.classList.remove('orange', 'green');
                }
                else if (buffPercentage < 100 && buffPercentage > 95) {
                    p.classList.add('orange');
                    p.classList.remove('red', 'green');
                }
                else {
                    p.classList.add('green');
                    p.classList.remove('red', 'orange');
                }
            }
        }); 
    }
  
    addBuffPercentage();
  
    let timeoutId = null;
    const observer = new MutationObserver(() => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            addBuffPercentage();
            timeoutId = null;
        }, 1000);
    });
    observer.observe(document.body, { subtree: true, childList: true });
});