import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import Divider from "@mui/material/Divider";
import ArticleCard from "./ArticleCard";
import ArticleCardLoading from "./ArticleCard/ArticleCardLoading";
import ArticleCardError from "./ArticleCard/ArticleCardError";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageNumForTopic } from "../state/slices/topicsSlice";
import { fetchArticlesForSavedTopic } from "../state/slices/articlesSlice";

export default function TopicCard({ currentTab }) {
    const session = useSelector((state) => state.session.session);
    const dispatch = useDispatch();
    const topic = useSelector((state) => state.topics.topics.find(topic => topic.id === currentTab));
    const { id, topic: topicName, pageNum } = topic;
    const [ page, setPage ] = useState(pageNum);

    useEffect(() => {
        dispatch(fetchArticlesForSavedTopic(topic));
    }, [session, page, id]);
    
    const articlesByTopic = useSelector((state) => state.articles.articlesBySavedTopics[topic.id]);
    const { articles, totalPages, loading, error } = articlesByTopic ? articlesByTopic : { articles: [], totalPages: 0, loading: true, error: null };

    const handlePageChange = (e, value) => {
        dispatch(setPageNumForTopic({ topicId: id, pageNum: value }));
        setPage(value);
    }

    const renderArticles = () => {
        if (loading) {
            return [...Array(10)].map((_, index) => {
                return <ArticleCardLoading key={index} />
            })
        } else if (error) {
            return <ArticleCardError />
        } else {
            return (
                <Stack spacing={4}>
                    {articles.map((article, index) => {
                        if (index === articles.length - 1) {
                            return <ArticleCard key={index} article={article} />
                        } else return (
                            <>
                                <ArticleCard key={index} article={article} />
                                <Divider variant='middle' className="mx-5" />
                            </>
                        )
                    })}
                    <Pagination 
                        count={totalPages} 
                        page={page} 
                        onChange={handlePageChange}
                        color='secondary'
                        className='mx-auto' 
                    />
                </Stack>
            )
        }
    }

    return (
        <Box component='section' className='shadow-lg rounded-md my-5 pb-5 relative' >
            <Typography 
                component='h1' 
                variant='h1'
                className='tracking-wider font-semibold md:text-center m-4'
                fontFamily={ 'Merriweather, serif' }
            >
                {topicName} 
            </Typography>
            {renderArticles()}
        </Box>
    )
}