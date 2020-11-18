$(document).ready(function(){
let nameInp = $('.name-input');
let surNameInp = $('.surname-input');
let numberInp = $('.number-input');
let btnAdd = $('.btn-add');
let page = 1;
let editName = $('.editName-inp');
let editSurName= $('.editSurName-inp')
let editPhone = $('.editPhone-inp')
// let itemCount = 1;
let pageCount = 1;
let searchValue = ''


$('.search-inp').on('input', function(e){
    searchValue = e.target.value
    render()
})
// let conList = $('.contacts')

// let api = 'http://localhost:8000/contacts';

function getPagination(){
fetch(`http://localhost:8000/contacts`)
.then(res => res.json())
.then(data => {
    // itemCount = data.length;
     pageCount = Math.ceil(data.length / 5)
     $('.pagination-page').remove()
    for(let i = pageCount; i >= 1 ; i--){
        $('.prev-btn').after(`
        <psan class = "pagination-page"><a href="#" alt = "..." class="page-num">${i}</a></span>
        `)
    }
})
}
$('body').on('click','.pagination-page', function(event){
    page = event.target.innerText
    render()
})


btnAdd.on('click', function(){
    if(!nameInp.val().trim() || !surNameInp.val().trim() || !numberInp.val().trim()){
        alert('Заполните все поля!')
    }
    let newInfo = {
        name:nameInp.val(),
        surname: surNameInp.val(),
        numberInp: numberInp.val()
    }
    postNewInfo(newInfo)
    nameInp.val('');
    surNameInp.val('');
    numberInp.val('');
    render()
})


function postNewInfo(newInfo){
    fetch('http://localhost:8000/contacts',{
        method:'POST',
        body:JSON.stringify(newInfo),
        headers:{
            'Content-type':'application/json;charset=utf-8'
        }
    })
    .then(()=> render())
}

function render(){
       fetch(`http://localhost:8000/contacts?_page=${page}&_limit=4&q=${searchValue}`)           
        .then(response => response.json())
        .then(data => {
            getPagination()
            $('.contacts').html('')
            data.forEach(item => {
                $('.contacts').append(`<li id=${item.id} class = "nummers">${item.name} ${item.surname} : ${item.numberInp} <span class = "all"><span class = "btn-delete">&times;</span><span class = "btn-edit">edit</span></span></li>`)
            })
            
            
        })
    }
   
    $('body').on('click','.btn-delete',function(event){
            // console.log('delete');
            let id = event.target.parentNode.id
            fetch(`http://localhost:8000/contacts/${id}`,{
                method: 'DELETE'
            })
            .then((res)=> res.json())
            .then(data => render())
            
            
        })

       $(' body').on('click','.btn-edit', function(event){
            let id = event.target.parentNode.parentNode.id;
            fetch(`http://localhost:8000/contacts/${id}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                editName.val(data.name) ;
                editSurName.val(data.surname);
                editPhone.val(data.numberInp)

                $('.btn-save').attr('id',id)          
            $('.main-modal').css('display','block')
        })
        })

    $('.btn-save').on('click', function(event){
        let id = event.target.id 
      
      let obj = {
          name:editName.val(),
          surname:editSurName.val(),
          numberInp:editPhone.val()
      }
      fetch(`http://localhost:8000/contacts/${id}`,{
          method:'PATCH',
          body: JSON.stringify(obj),
          headers:{'Content-type':'application/json'}
      })
      .then(res => {render()
    $('.main-modal').css('display','none')
    })
    })

    $('.next-btn').on('click',function(){
        if(page >= pageCount) return
        page++        
        render()
    })
    $('.prev-btn').on('click',function(){
        if(page <= 1) return
        page--       
        render()
    })
    $('.btn-close').on('click', function(){
        $('.main-modal').css('display','none')
    })
    render()

})