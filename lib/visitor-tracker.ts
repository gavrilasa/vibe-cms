import { prisma } from './prisma';

export const trackVisitor = async (ipAddress: string, userAgent: string, page: string) => {
  try {
    await prisma.visitor.create({
      data: {
        ipAddress,
        userAgent,
        page,
      },
    });
  } catch (error) {
    console.error('Error tracking visitor:', error);
  }
};

export const getVisitorStats = async () => {
  try {
    const totalVisitors = await prisma.visitor.count();
    const todayVisitors = await prisma.visitor.count({
      where: {
        visitedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });
    const uniqueVisitors = await prisma.visitor.groupBy({
      by: ['ipAddress'],
      _count: {
        ipAddress: true,
      },
    });

    return {
      totalVisitors,
      todayVisitors,
      uniqueVisitors: uniqueVisitors.length,
    };
  } catch (error) {
    console.error('Error getting visitor stats:', error);
    return { totalVisitors: 0, todayVisitors: 0, uniqueVisitors: 0 };
  }
};