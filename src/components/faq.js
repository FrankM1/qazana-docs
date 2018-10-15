import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import getPostExcerpt from '../utils/post-excerpt'
import { Spirit } from './spirit-styles'

const FAQ = (props) => {
    const post = props.post
    const url = `/faq/${post.slug}/`
    const excerpt = getPostExcerpt(post)

    return (
        <Link to={url} className="f5 db tdn">
            <h4 className={`${Spirit.p} link blue fw5`} to={url}>{post.title} &raquo;</h4>
            {excerpt ? <p className={`${Spirit.small}ma0 f8 lh-copy middarkgrey mb10`}>{excerpt}</p> : null}
        </Link>
    )
}

FAQ.propTypes = {
    post: PropTypes.object.isRequired,
}

export default FAQ
