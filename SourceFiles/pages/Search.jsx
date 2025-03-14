import SearchBar from '../components/SearchBar';
import ArticleCard from "../components/ArticleCard";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSearchQuery, fetchArticlesByQuery, setSearchPageNum } from '../state/slices/articlesSlice';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import Divider from '@mui/material/Divider';
import ArticleCardLoading from '../components/ArticleCard/ArticleCardLoading';
import ArticleCardError from '../components/ArticleCard/ArticleCardError';
import ArticleCardNoResults from '../components/ArticleCard/ArticleCardNoResults';

export default function Search() {
    const dispatch = useDispatch();
    const searchQuery = useSelector(state => state.articles.search.query);
    const searchPage = useSelector(state => state.articles.search.pageNum);
    const loading = useSelector(state => state.articles.search.loading);
    const error = useSelector(state => state.articles.search.error);
    const articles = useSelector(state => state.articles.search.articles);
    const totalPages = useSelector(state => state.articles.search.totalPages);

    const [displayedQuery, setDisplayedQuery] = useState(searchQuery);
    const [displayedSearchPage, setDisplayedSearchPage] = useState(searchPage);
    const [ searched, setSearched ] = useState(false);

    const handleSearchQueryChange = (e) => {
        setSearched(false);
        const newQuery = e.target.value;
        setDisplayedQuery(newQuery);
        dispatch(setSearchQuery(newQuery));
    };

    const handlePageChange = (e, value) => {
        setDisplayedSearchPage(value);
        dispatch(setSearchPageNum(value));
        dispatch(fetchArticlesByQuery());
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (displayedQuery === '') {
            return;
        }
        setSearched(true);
        setDisplayedSearchPage(1);
        dispatch(setSearchPageNum(1));
        dispatch(fetchArticlesByQuery());
    }

    const renderSearchResults = () => {
        if (loading) {
            return <ArticleCardLoading />
        } else if (error) {
            return <ArticleCardError />
        } else if (searched && articles.length === 0) {
            return <ArticleCardNoResults />
        } else {
            return (
                <Stack spacing={4}>
                    {
                        articles.map((article, index) => {
                            if (index === articles.length - 1) {
                                return <ArticleCard key={index} article={article} />
                            } else return (
                                <>
                                    <ArticleCard key={index} article={article} />
                                    <Divider variant='middle' className="mx-5" />
                                </>
                            )
                        })
                    }
                    {
                        articles.length > 0 && 
                        <Pagination className='mx-auto' count={totalPages} page={displayedSearchPage} onChange={handlePageChange} color='primary' />
                    }
                </Stack>
            )
        }
    }

    return (
        <Container className='my-5' >
            <SearchBar query={searchQuery} displayedQuery={displayedQuery} handleSearchQueryChange={handleSearchQueryChange} handleSubmit={handleSubmit} />
            {renderSearchResults()}
        </Container>
    );
}