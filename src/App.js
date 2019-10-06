import React, { Component, Fragment } from 'react'
import * as _ from 'lodash'
import copy from 'copy-to-clipboard'

import './App.css'

import 'bootstrap/dist/css/bootstrap.min.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: window.localStorage.getItem('product-title-title') ? window.localStorage.getItem('product-title-title') : '',
      vrac: window.localStorage.getItem('product-title-vrac') ? window.localStorage.getItem('product-title-vrac') : '',
    }
  }

  render() {
    const {
      match,
    } = this.props

    const { vrac, title } = this.state

    const allWords = vrac.replace(/\n/g, ' ').replace(/\s+/g, ' ').split(' ').filter(word => word !== '')

    const removedDuplicates = allWords.reduce((removedDuplicates, word) => {
      if (removedDuplicates[ word ]) {
        removedDuplicates[ word ].occurrences = removedDuplicates[ word ].occurrences + 1
      } else {
        removedDuplicates[ word ] = {
          word,
          isInTitle: title.toLowerCase().split(' ').indexOf(word.toLowerCase()) !== -1,
          occurrences: 1,
        }
      }
      return removedDuplicates
    }, {})

    const capitalizeFirstLetters = str => str.split('\n').map(str => str.split(' ').map(word => word ? word[ 0 ].toUpperCase() + word.slice(1, word.length) : '').join(' ')).join('\n')

    const removeDoubleSpace = str => str.replace(/ {2}/g, ' ').replace(/ {3}/g, ' ').replace(/ {4}/g, ' ').replace(/ {5}/g, ' ').replace(/ {5}/g, ' ').replace(/ {6}/g, ' ')

    const setTitle = (title) => {
      window.localStorage.setItem('product-title-title', title)
      return this.setState({ title })
    }
    const setKeywords = (keywords) => {
      window.localStorage.setItem('product-title-vrac', keywords)
      return this.setState({ vrac: keywords })
    }

    const reset = () => {
      setTitle('')
      setKeywords('')
    }

    return <div className='container'>
      <div className='row pt-5'>
        <div className='col-12 mb-5'>
          <div className='h2'>Optimisation de nom de produit</div>
        </div>
        <div className='col-12 mb-2'>
          <span className='h3'>1. Entrez les mots clés en vrac</span>
        </div>
        <div className='col-10 mb-5'>
          <textarea name='vrac' id='vrac' style={{ width: '100%', height: 200 }}
                    onChange={e => setKeywords(e.target.value)} value={vrac}></textarea>
        </div>
        <div className='col-2'>
          <a href='javascript:' className='btn btn-danger' onClick={() => reset()}>Remettre à zéro</a>
        </div>

        <div className='col-6 mb-5'>
          {_.reverse(_.sortBy(removedDuplicates, 'occurrences')).map(({ word, occurrences, isInTitle }) =>
            isInTitle ? null : <span className='font-weight-bold keyword-to-add'
                                     onClick={() => setTitle(title ? title + ' ' + capitalizeFirstLetters(word) : capitalizeFirstLetters(word))}>{word}
              <small>({occurrences})</small> </span>)}
        </div>

        <div className='col-6 mb-5'>
          {_.reverse(_.sortBy(removedDuplicates, 'occurrences')).map(({ word, occurrences, isInTitle }) =>
            isInTitle ? <span><del>{word}({occurrences})</del> </span> : null)}
        </div>

        <div className='col-12'>
          <div className='row'>


            <div className='col-12 mb-2'>
              <span className='h3'>2. Composez votre titre</span>
            </div>
            <div className='col-10'>
              <textarea type='text' value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: '100%', height: 300, fontSize: 30 }}></textarea>
            </div>

            <div className='col-2'>
              <div className='row'>
                <div className='col-12 mb-3 font-weight-bold'>
                  {title.length} / 200
                </div>
                <div className='col-12 mb-5'>
                  <a className={'font-weight-bold btn ' + ( this.state.copied ? 'btn-success' : 'btn-primary' )}
                     onClick={() => {
                       this.setState({ copied: true })
                       clearTimeout(this.copiedTimeout)
                       this.copiedTimeout = setTimeout(() => {
                         this.setState({ copied: false })
                       }, 2000)
                       return copy(title)
                     }} href='javascript:'>{this.state.copied ? '✓ copié' : 'Copier le titre'}
                  </a>
                </div>
                <div className='col-12 mb-5'>
                  <a className={'font-weight-bold btn btn-outline-primary'}
                     onClick={() => {
                       setTitle(removeDoubleSpace(capitalizeFirstLetters(title)))
                     }} href='javascript:'>Formater et nettoyer
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  }
}

export default App
