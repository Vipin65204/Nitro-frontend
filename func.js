            
        
            let globalVariable; // id
            let dd;

            let sourceData = {
                // isLoading: true,
                checkboxSelection: 0,
                sortBy: ['weekNumber', 'author', 'location'],
                viewBy: ['author', 'formattedTime', 'author'],
                data: [],
                uniqueArrayObj: [],
                photoURL: `https://picsum.photos/id/${globalVariable}/50/50`


            }

             populate = () => {
                        const uniqueSet = new Set();

                        //  0 == week
                        //  1 == author
                        //  2 == location

                        sourceData.data.forEach(entry => {
                          
                            const chkbox = sourceData.checkboxSelection                            
                            const sortByValue = entry[sourceData.sortBy[chkbox]];
                            uniqueSet.add(sortByValue);

                        });

                        const uniqueArray = Array.from(uniqueSet);
                        sourceData.uniqueArrayObj = uniqueArray
                        
                        
                        const $ulElement = $('#myUL');
                        $.each(sourceData.uniqueArrayObj, function (index, wk) {
                            // Create a new list item element with a span inside it
                            const listItem = $('<li><span class="caret"> ' + wk + '</span></li>');

                            // Append the list item element to the list
                            $ulElement.append(listItem);
                            const ulElementNested = $('<ul class="nested"></ul>');

                            listItem.append(ulElementNested);


                            // ------ end of post by author --------
                            
                            //  ------ post by location ------
                            const locationPost = sourceData.data.filter(item => item[sourceData.sortBy[sourceData.checkboxSelection]] === wk);
                            locationPost.forEach(postsByWeek => {



                                timeStampItem = postsByWeek[sourceData.viewBy[sourceData.checkboxSelection]];

                                const liElement = $(`<li>${postsByWeek[sourceData.viewBy[sourceData.checkboxSelection]]}</li>`);

                                console.log('time', postsByWeek[sourceData.viewBy[sourceData.checkboxSelection]]);

                                liElement.click(function () {
                                    globalVariable = postsByWeek.id
                                    $('#contentDiv').show();


                                    $('.profile-image').attr('src', `https://picsum.photos/id/${globalVariable}/50/50`);

                                    $('#post-content').text(postsByWeek.text);
                                    $('#post-auth').text(postsByWeek.author);
                                    $('#post-time').text(`Posted on ${formatTimestamp(postsByWeek.time)} |`);
                                    $('#post-location').text(`Location: ${postsByWeek.location}`);

                                });

                                // // Append the LI element to the UL element
                                ulElementNested.append(liElement);
                                //  ------ post by location end------
                            });
                        });

                        var toggler = document.getElementsByClassName("caret");
                        var i;

                        for (i = 0; i < toggler.length; i++) {

                            toggler[i].addEventListener("click", function () {
                                this.parentElement.querySelector(".nested").classList.toggle("active");
                                this.classList.toggle("caret-down");

                            });
                        }

                    } 
                    //---- end of populate data-----

                
     const fetchData = async (url) => {


         try {
   
    const response = await axios.get(url);
 
                    sourceData.data = response.data;
                   

                    // // Add the "weekNumber" and "year" properties to each item in the array
                    sourceData.data.forEach(item => {
                        const { weekNumber, year } = getWeekNumAndYear(item.time);
                        item.weekNumber = weekNumber;
                        item.year = year;
                        item.formattedTime = formatTimestamp(item.time);
                    });




                
                    populate();
                    editFunction();
                    saveEdit();

               } catch (error) {
                
                    console.error('Axios error:', error);
                };


// radio button listner
// radioOnchange
sortSelection();
          

}

 function getWeekNumAndYear(timestamp) {
                        const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
                        const onejan = new Date(date.getFullYear(), 0, 1);
                        const millisecsInDay = 86400000; // 24 * 60 * 60 * 1000
                        const dayOfYear = (date - onejan) / millisecsInDay;
                        const weekNumber = Math.ceil((dayOfYear + onejan.getDay() + 1) / 7);

                        const year = date.getFullYear();
                        return { weekNumber, year };
                    }

                   


                   

//editFunction 
editFunction = () =>{
                        $('#edit-button').click(function () {

                        const editPost = sourceData.data.find(item => item.id === globalVariable);

                        console.log("editpost", editPost.id);
                        $('#locationInput').val(editPost.location);
                        $('#authorInput').val(editPost.author);

                    });

}
   //saveEdit function
 saveEdit =() =>{
                        $('#saveChangesBtn').click(function () {


                        // Get the updated values from the input fields
                        const newLocation = $('#locationInput').val();
                        const newAuthor = $('#authorInput').val();

                        const isValidLocation = /^[a-zA-Z\s]+$/.test(newLocation);
                        const isValidAuthor = /^[a-zA-Z\s]+$/.test(newAuthor);

                        // Check if the location is valid
                        if (isValidLocation && isValidAuthor) {
                            // Perform the save operation or other logic
                            console.log('Location is valid:', newLocation);

                            const editedPostIndex = sourceData.data.findIndex(post => post.id === globalVariable);
                            console.log("editedPostIndex", editedPostIndex);
                            if (editedPostIndex !== -1) {
                                sourceData.data[editedPostIndex].location = newLocation;
                                sourceData.data[editedPostIndex].author = newAuthor;


                                // Append the updated values to the corresponding HTML elements
                                $('#post-location').text(`Location: ${newLocation}`);
                                $('#post-auth').text(newAuthor);
                                console.log('Updated Post:', dd);
                            }
                            $('#editModal').modal('hide');
                            $('#myUL').empty();

                            console.log('changed', dd);
                            populate();
                        } else {
                            // Display an error or prevent further processing
                            alert('Invalid Details .Please enter only letters and spaces.');
                        }



                    });
   }

   sortSelection=()=>{
  $('input[name="group1"]').on('change', function () {
                // Get the selected radio button value
                const selectedValue = $('input[name="group1"]:checked').val();
                sourceData.checkboxSelection = selectedValue;

                $('#myUL').empty();
                populate()


                $('#contentDiv').hide();


            });
}