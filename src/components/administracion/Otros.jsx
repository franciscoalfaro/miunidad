import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global'
import useAuth from '../../hooks/useAuth'
import { Link } from 'react-router-dom'
import { generatePaginationNumbers } from '../../helpers/generatePagination'

export const Otros = () => {
  const auth = useAuth({})
  const [directorios, setDirectorios] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)


  useEffect(() => {
    getFolders(page)
  }, [page])

  const nextPage = () => {
    let next = page + 1;
    setPage(next);

  }
  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  }


  const visiblePageNumbers = generatePaginationNumbers(totalPages, page);

  const getFolders = async (nextPage = 1) => {

    try {
      const request = await fetch(Global.url + 'directory/listAll/' + nextPage, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },credentials: 'include',

      })

      const data = await request.json()

      if (data.status === 'success') {
        setDirectorios(data.directorios)
        setTotalPages(data.page)

      } else {
        console.log(data.message)
      }


    } catch (error) {
      console.log('code', error)
    }



  }

  return (
    <>
<br></br>
      <div className="row">
        {directorios.length === 0 ? (
          <p>No existen directorios.</p>
        ) : (
          directorios.map((folders) => (
            <div className="col-md-3 mb-4" key={folders._id}>
              <div className="card">
                <div className="card-body">
                  <i className="bi bi-folder folder-icon"></i>
                  <p className="card-text mt-2">
                    {folders.createdBy.name} {folders.createdBy.surname}
                  </p>
                  <Link to={`/auth/archivos/${folders._id}`} className="stretched-link"></Link>
                  
                </div>
              </div>
            </div>
          ))
        )}
      </div>



      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
            <a className="page-link" href="#" onClick={prevPage}><i className="bi bi-chevron-left"></i></a>
          </li>
          {visiblePageNumbers.map((pageNumber) => (
            <li key={pageNumber} className={`page-item ${page === pageNumber ? 'active' : ''}`}>
              <a className="page-link" href="#" onClick={() => setPage(pageNumber)}>{pageNumber}</a>
            </li>
          ))}
          <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
            <a className="page-link" href="#" onClick={nextPage}><i className="bi bi-chevron-right"></i></a>


          </li>
        </ul>
      </nav>


    </>
  )
}
